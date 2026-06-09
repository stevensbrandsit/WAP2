import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ResearchMap.css';

const REGION_OPTIONS = [
  { value: 'europe', label: 'Europe', description: 'Stations within Europe' },
  { value: 'japan', label: 'Japan', description: 'Stations within Japan' },
];

const METRIC_OPTIONS = [
  { value: 'temperature', label: 'Temperature', unit: 'deg C' },
  { value: 'humidity', label: 'Humidity', unit: '%' },
  { value: 'rainfall', label: 'Rainfall', unit: 'mm' },
  { value: 'wind_speed', label: 'Wind Speed', unit: 'knots' },
];

const FALLBACK_VIEWPORT = {
  europe: { center: [54.5, 15.0], zoom: 4 },
  japan: { center: [36.2, 138.3], zoom: 5 },
};

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatMetricValue(value, metric) {
  if (!isFiniteNumber(value)) {
    return 'No data';
  }

  const digits = metric === 'humidity' ? 1 : 2;
  const unit = METRIC_OPTIONS.find((option) => option.value === metric)?.unit ?? '';
  return `${value.toFixed(digits)} ${unit}`.trim();
}

function hasMetricValue(point, metric) {
  return isFiniteNumber(point?.measurement?.[metric]);
}

function getMetricColor(metric, value, min, max) {
  if (!isFiniteNumber(value)) {
    return '#64748b';
  }

  const ratio = min === max ? 0.5 : (value - min) / (max - min);
  const clamped = Math.min(1, Math.max(0, ratio));

  if (metric === 'temperature') {
    if (clamped < 0.2) return '#1d4ed8';
    if (clamped < 0.4) return '#0ea5e9';
    if (clamped < 0.6) return '#22c55e';
    if (clamped < 0.8) return '#f59e0b';
    return '#dc2626';
  }

  if (metric === 'humidity') {
    if (clamped < 0.2) return '#f59e0b';
    if (clamped < 0.4) return '#84cc16';
    if (clamped < 0.6) return '#14b8a6';
    if (clamped < 0.8) return '#0ea5e9';
    return '#2563eb';
  }

  if (metric === 'rainfall') {
    if (clamped < 0.2) return '#a3a3a3';
    if (clamped < 0.4) return '#93c5fd';
    if (clamped < 0.6) return '#60a5fa';
    if (clamped < 0.8) return '#2563eb';
    return '#1d4ed8';
  }

  if (clamped < 0.2) return '#22c55e';
  if (clamped < 0.4) return '#84cc16';
  if (clamped < 0.6) return '#eab308';
  if (clamped < 0.8) return '#f97316';
  return '#dc2626';
}

function buildPopupContent(point) {
  const { station, measurement } = point;
  const locationParts = [station.city, station.state, station.country].filter(Boolean);

  return `
    <div class="map-popup">
      <h3>${escapeHtml(station.name)}</h3>
      <p>${escapeHtml(locationParts.join(', ') || 'Unknown location')}</p>
      <dl>
        <div><dt>Temperature</dt><dd>${escapeHtml(formatMetricValue(measurement.temperature, 'temperature'))}</dd></div>
        <div><dt>Humidity</dt><dd>${escapeHtml(formatMetricValue(measurement.humidity, 'humidity'))}</dd></div>
        <div><dt>Rainfall</dt><dd>${escapeHtml(formatMetricValue(measurement.rainfall, 'rainfall'))}</dd></div>
        <div><dt>Wind Speed</dt><dd>${escapeHtml(formatMetricValue(measurement.wind_speed, 'wind_speed'))}</dd></div>
      </dl>
      <p>Latest reading: ${escapeHtml(`${measurement.date ?? '-'} ${measurement.time ?? ''}`.trim())}</p>
    </div>
  `;
}

function ResearchMap() {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [region, setRegion] = useState('europe');
  const [metric, setMetric] = useState('temperature');
  const [showMeasuredOnly, setShowMeasuredOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) {
      return undefined;
    }

    const map = L.map(mapElementRef.current, {
      zoomControl: true,
      minZoom: 2,
      worldCopyJump: false,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-bijdragers',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    const fallback = FALLBACK_VIEWPORT.europe;
    map.setView(fallback.center, fallback.zoom);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMapData() {
      setLoading(true);
      setError('');
      setPayload(null);

      try {
        const contract = localStorage.getItem('contract');
        const token = localStorage.getItem('token');

        if (!contract || !token) {
          throw new Error('No active contract session found.');
        }

        const response = await fetch(`/IWA/contracten/${contract}/map-data?region=${region}&limit=700`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'The map data could not be loaded.');
        }

        setPayload(data);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unknown error while loading map data.');
          setPayload(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMapData();
    return () => controller.abort();
  }, [region]);

  const stations = useMemo(() => {
    const rawStations = Array.isArray(payload?.stations) ? payload.stations : [];

    return rawStations.filter((point) => {
      const latitude = point?.station?.latitude;
      const longitude = point?.station?.longitude;
      return isFiniteNumber(latitude) && isFiniteNumber(longitude);
    });
  }, [payload]);

  const metricValues = useMemo(
    () =>
      stations
        .map((point) => point?.measurement?.[metric])
        .filter((value) => isFiniteNumber(value)),
    [stations, metric]
  );

  const visibleStations = useMemo(() => {
    if (!showMeasuredOnly) {
      return stations;
    }

    return stations.filter((point) => hasMetricValue(point, metric));
  }, [metric, showMeasuredOnly, stations]);

  const metricRange = useMemo(() => {
    if (metricValues.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...metricValues),
      max: Math.max(...metricValues),
    };
  }, [metricValues]);

  const summary = useMemo(() => {
    const average =
      metricValues.length > 0
        ? metricValues.reduce((total, value) => total + value, 0) / metricValues.length
        : null;

    const topStations = [...stations]
      .filter((point) => hasMetricValue(point, metric))
      .sort((left, right) => right.measurement[metric] - left.measurement[metric])
      .slice(0, 5);

    return {
      average,
      availableMeasurements: metricValues.length,
      visibleStations: visibleStations.length,
      topStations,
    };
  }, [metricValues, metric, stations, visibleStations.length]);

  const activeMetric = useMemo(
    () => METRIC_OPTIONS.find((option) => option.value === metric) ?? METRIC_OPTIONS[0],
    [metric]
  );

  const activeRegionKey = payload?.region ?? region;

  const activeRegion = useMemo(
    () => REGION_OPTIONS.find((option) => option.value === activeRegionKey) ?? REGION_OPTIONS[0],
    [activeRegionKey]
  );

  const coveragePercentage = stations.length > 0
    ? Math.round((summary.availableMeasurements / stations.length) * 100)
    : 0;

  const latestMeasurementMoment = useMemo(() => {
    const moments = stations
      .map((point) => {
        const date = point?.measurement?.date;
        const time = point?.measurement?.time;
        if (!date) {
          return null;
        }

        return `${date}${time ? ` ${time}` : ''}`;
      })
      .filter(Boolean)
      .sort();

    return moments.length > 0 ? moments[moments.length - 1] : 'No recent reading';
  }, [stations]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerLayer = markersLayerRef.current;
    if (!map || !markerLayer) {
      return;
    }

    markerLayer.clearLayers();

    if (visibleStations.length === 0) {
      const fallbackViewport = payload?.viewport ?? FALLBACK_VIEWPORT[activeRegionKey] ?? FALLBACK_VIEWPORT.europe;
      map.setView(fallbackViewport.center, fallbackViewport.zoom);
      return;
    }

    const bounds = [];
    visibleStations.forEach((point) => {
      const value = point?.measurement?.[metric];
      const marker = L.circleMarker([point.station.latitude, point.station.longitude], {
        radius: 7,
        weight: 1.5,
        color: '#0f172a',
        fillColor: getMetricColor(metric, value, metricRange.min, metricRange.max),
        fillOpacity: 0.82,
      });

      marker.bindPopup(buildPopupContent(point), {
        maxWidth: 320,
      });

      markerLayer.addLayer(marker);
      bounds.push([point.station.latitude, point.station.longitude]);
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 6);
    } else {
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    window.setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [visibleStations, payload, activeRegionKey, metric, metricRange.max, metricRange.min]);

  return (
    <section className="research-map-section">
      <div className="research-map-header">
        <div>
          <span className="research-map-eyebrow">Research Map</span>
          <h2>Map validation by region and parameter</h2>
        </div>
      </div>

      <div className="research-map-layout">
        <div className="research-map-card">
          <div className="research-map-toolbar">
            <div className="research-map-toolbar__block">
              <p className="research-map-toolbar__label">Region</p>
              <div className="research-map-chip-row">
                {REGION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRegion(option.value)}
                    className={`research-map-chip ${region === option.value ? 'research-map-chip--active' : ''}`}
                  >
                    <span>{option.label}</span>
                    <small>{option.description}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="research-map-toolbar__block">
              <p className="research-map-toolbar__label">Parameter</p>
              <div className="research-map-metric-grid">
                {METRIC_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMetric(option.value)}
                    className={`research-map-metric-button ${metric === option.value ? 'research-map-metric-button--active' : ''}`}
                  >
                    <span>{option.label}</span>
                    <small>{option.unit}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="research-map-subtoolbar">
            <div>
              <p className="research-map-subtoolbar__title">{activeRegion.label}</p>
              <p className="research-map-subtoolbar__text">
                {showMeasuredOnly
                  ? 'Only stations with a recent value for this parameter are shown.'
                  : 'Stations without a recent value remain visible so missing coverage is immediately obvious.'}
              </p>
            </div>

            <label className="research-map-toggle">
              <input
                type="checkbox"
                checked={showMeasuredOnly}
                onChange={(event) => setShowMeasuredOnly(event.target.checked)}
              />
              <span>Hide stations without values</span>
            </label>
          </div>

          <div className="research-map-legend">
            <p className="research-map-legend__title">Range within the current selection</p>
            <div className="research-map-legend__scale" />
            <div className="research-map-legend__values">
              <span>{formatMetricValue(metricRange.min, metric)}</span>
              <span>{formatMetricValue(metricRange.max, metric)}</span>
            </div>
          </div>

          <div className="research-map-canvas-shell">
            <div ref={mapElementRef} className="research-map-canvas" />
            {loading && <div className="research-map-overlay">Loading map data...</div>}
            {!loading && error && <div className="research-map-overlay research-map-overlay-error">{error}</div>}
          </div>
        </div>

        <aside className="research-map-sidebar">
          <div className="research-map-sidebar__section">
            <div className="research-map-sidebar__intro">
              <div>
                <span className="research-map-eyebrow">Measurement Overview</span>
                <h3>{activeRegion.label}</h3>
              </div>
              <span className="research-map-coverage">{coveragePercentage}% with values</span>
            </div>

            <div className="research-map-stats">
              <article className="research-map-stat">
                <p className="research-map-stat__label">Stations</p>
                <p className="research-map-stat__value">{stations.length}</p>
              </article>
              <article className="research-map-stat">
                <p className="research-map-stat__label">Visible</p>
                <p className="research-map-stat__value">{summary.visibleStations}</p>
              </article>
              <article className="research-map-stat">
                <p className="research-map-stat__label">Readings</p>
                <p className="research-map-stat__value">{summary.availableMeasurements}</p>
              </article>
              <article className="research-map-stat research-map-stat--wide">
                <p className="research-map-stat__label">Average {activeMetric.label.toLowerCase()}</p>
                <p className="research-map-stat__value">
                  {summary.average === null ? 'No data' : formatMetricValue(summary.average, metric)}
                </p>
              </article>
            </div>

            <dl className="research-map-facts">
              <div>
                <dt>Latest reading time</dt>
                <dd>{latestMeasurementMoment}</dd>
              </div>
              <div>
                <dt>Selected parameter</dt>
                <dd>{activeMetric.label}</dd>
              </div>
            </dl>
          </div>

          <div className="research-map-sidebar__section research-map-insight">
            {stations.length === 0 && 'The backend returned no stations for this region.'}
            {stations.length > 0 && summary.availableMeasurements === 0 && (
              'Stations were found, but there is no recent reading yet for this parameter. Check the generator run and database data.'
            )}
            {summary.availableMeasurements > 0 && summary.availableMeasurements < stations.length && (
              `A recent ${activeMetric.label.toLowerCase()} value is available for ${summary.availableMeasurements} out of ${stations.length} stations.`
            )}
            {summary.availableMeasurements === stations.length && stations.length > 0 && (
              'All displayed stations have a recent value for the selected parameter.'
            )}
          </div>

          <div className="research-map-sidebar__section">
            <div className="research-map-sidebar__title-row">
              <h4>Highest measured values</h4>
              <span>{activeMetric.label}</span>
            </div>
            <div className="research-map-topstations">
              {summary.topStations.length === 0 && (
                <p className="research-map-empty">There are no usable readings yet for this parameter.</p>
              )}
              {summary.topStations.map((point) => (
                <article key={`${point.station.name}-${metric}`} className="research-map-topstation">
                  <div>
                    <p className="research-map-topstation__name">{point.station.name}</p>
                    <p className="research-map-topstation__location">
                      {[point.station.city, point.station.state, point.station.country].filter(Boolean).join(', ') || 'Unknown location'}
                    </p>
                  </div>
                  <p className="research-map-topstation__value">
                    {formatMetricValue(point.measurement[metric], metric)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default ResearchMap;
