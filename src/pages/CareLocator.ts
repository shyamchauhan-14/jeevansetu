import { HealthcareFacility, FacilityType } from '../types/health';
import { renderHospitalCard } from '../components/HospitalCard';
import { I18nService } from '../services/i18nService';

export function renderCareLocatorPage(
  facilities: HealthcareFacility[],
  activeFilter: string,
  searchQuery: string
): string {
  const t = (key: string, def: string = '') => I18nService.t(key, def);

  const facilityCardsHtml = facilities.length > 0
    ? facilities.map((facility) => renderHospitalCard(facility)).join('')
    : `
      <div class="card card--paper" style="text-align: center; padding: var(--space-2xl); border-radius: var(--radius-xl);">
        <div style="font-size: 3rem; margin-bottom: 12px;">🏥</div>
        <h3 class="text-h4">No facilities match "${searchQuery}"</h3>
        <p class="text-muted" style="margin-top: 6px; font-size: var(--text-sm);">
          Try searching by village name, pincode (e.g. 410501), or filter by "All Centers".
        </p>
        <button type="button" class="btn btn--primary btn--sm" style="margin-top: 14px;" onclick="window.clearLocatorSearch()">
          Clear Search & Show All
        </button>
      </div>
    `;

  const filterButtons: { label: string; icon: string; value: FacilityType | 'ALL' }[] = [
    { label: 'All Centers', icon: '🏥', value: 'ALL' },
    { label: 'PHC (Primary)', icon: '🩺', value: 'Primary Health Centre (PHC)' },
    { label: 'CHC (Community)', icon: '🏛️', value: 'Community Health Centre (CHC)' },
    { label: 'District Hospital', icon: '🏨', value: 'District Hospital' },
    { label: '24/7 Pharmacy', icon: '💊', value: '24/7 Pharmacy' },
    { label: 'Private Clinic', icon: '🩹', value: 'Private Clinic' }
  ];

  const filterChipsHtml = filterButtons
    .map(
      (btn) => `
      <button 
        type="button" 
        class="chip ${activeFilter === btn.value ? 'selected' : ''}" 
        style="display: inline-flex; align-items: center; gap: 6px; font-weight: 600;"
        onclick="window.setLocatorFilter('${btn.value}')"
        aria-pressed="${activeFilter === btn.value}"
      >
        <span>${btn.icon}</span>
        <span>${btn.label}</span>
      </button>
    `
    )
    .join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl);">
        
        <!-- Header Banner -->
        <div style="margin-bottom: var(--space-xl);">
          <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            ${t('locator.label', 'HEALTHCARE LOCATOR & RADAR')}
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            ${t('locator.title', 'Find Verified Healthcare Near You')}
          </h1>
          <p class="text-base text-muted" style="max-width: 680px;">
            ${t('locator.subtitle', 'Live verified government Primary Health Centres (PHC), Community Hospitals (CHC), sub-district emergency centers, and 24/7 medical stores within your rural network.')}
          </p>
        </div>

        <!-- Search & Filter Controls Card -->
        <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); padding: var(--space-lg);">
          
          <!-- Search Bar with Instant Filter & Clear Button -->
          <div style="position: relative; margin-bottom: var(--space-md);">
            <div style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 1.2rem; pointer-events: none; color: var(--color-text-muted);">
              🔍
            </div>
            <input 
              id="care-locator-search-input"
              type="text" 
              class="input"
              style="width: 100%; padding: 14px 40px 14px 44px; font-size: var(--text-base); border-radius: var(--radius-lg); border: 2px solid var(--color-gray-200); transition: border-color 0.2s;"
              placeholder="${t('locator.search', 'Search by facility name, village, pincode, specialty (e.g. snakebite, ICU, PHC)...')}" 
              value="${searchQuery}"
              oninput="window.handleLocatorSearch(this.value)"
              autocomplete="off"
            />
            ${
              searchQuery
                ? `<button 
                     type="button" 
                     onclick="window.clearLocatorSearch()" 
                     style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 1.1rem; color: var(--color-text-muted); cursor: pointer; padding: 4px;"
                     title="Clear search"
                   >
                     ✕
                   </button>`
                : ''
            }
          </div>

          <!-- Quick Type Filters -->
          <div>
            <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: var(--tracking-wider); margin-bottom: 8px; color: var(--color-text-muted); display: flex; justify-content: space-between; align-items: center;">
              <span>Filter by Facility Type</span>
              <span style="font-size: 0.75rem; font-weight: 500; color: var(--color-primary-dark);">Showing sorted by nearest first</span>
            </div>
            <div class="chip-group" style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${filterChipsHtml}
            </div>
          </div>
        </div>

        <!-- Mobile View Switcher (Tabs) -->
        <div class="mobile-locator-tabs" style="display: none; margin-bottom: var(--space-md); gap: 8px;">
          <button type="button" id="btn-show-list" class="btn btn--primary btn--sm" style="flex: 1;" onclick="window.switchLocatorView('list')">
            📋 Hospital List (<span id="tab-count">${facilities.length}</span>)
          </button>
          <button type="button" id="btn-show-map" class="btn btn--secondary btn--sm" style="flex: 1;" onclick="window.switchLocatorView('map')">
            🗺️ Interactive Map
          </button>
        </div>

        <!-- Bento Grid: Facility Cards (Left) + Interactive Map (Right) -->
        <div class="bento-grid" style="gap: var(--card-gap); align-items: flex-start;">
          
          <!-- Facility List Column -->
          <div id="facility-list-column" class="col-span-7" style="display: flex; flex-direction: column; gap: var(--space-md);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; padding-bottom: 4px;">
              <span id="facility-count-badge" style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); text-transform: uppercase; color: var(--color-text-main);">
                ${facilities.length} Verified Facilities Located Nearby
              </span>
              <div style="display: flex; gap: 6px;">
                <span class="badge badge--green">📍 GPS: Pune Rural</span>
                <span class="badge badge--black">Radius: 30 km</span>
              </div>
            </div>

            <!-- List container dynamically refreshed by search without resetting input -->
            <div id="facility-cards-container" style="display: flex; flex-direction: column; gap: var(--space-md);">
              ${facilityCardsHtml}
            </div>
          </div>

          <!-- Interactive Map Column (Sticky on Desktop) -->
          <div id="facility-map-column" class="col-span-5" style="position: sticky; top: 85px; display: flex; flex-direction: column; gap: var(--space-md);">
            
            <!-- Map Container Card -->
            <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-md); box-shadow: var(--shadow-md); overflow: hidden;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 1.2rem;">🗺️</span>
                  <div>
                    <h4 style="font-size: var(--text-sm); font-weight: var(--font-weight-bold); line-height: 1.2;">Live GPS Map & Radar</h4>
                    <span style="font-size: 0.72rem; color: var(--color-text-muted);">Tap pins for instant directions & phone</span>
                  </div>
                </div>
                <button type="button" class="btn btn--outline btn--sm" style="font-size: 0.75rem; padding: 4px 8px;" onclick="window.fitAllMapMarkers()" title="Center all centers">
                  ⛶ Fit All
                </button>
              </div>

              <!-- Real Interactive Leaflet Map Container -->
              <div 
                id="care-map" 
                style="height: 420px; width: 100%; border-radius: var(--radius-lg); background: #e2e8f0; border: 1px solid var(--color-gray-200); position: relative;"
              >
                <!-- Loading indicator while map tiles hydrate -->
                <div id="map-loading-placeholder" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(248, 250, 252, 0.9); z-index: 500;">
                  <div style="font-size: 2rem; animation: pulse 1.5s infinite;">🧭</div>
                  <span style="font-size: 0.82rem; font-weight: 600; color: var(--color-text-muted); margin-top: 6px;">Initializing Live Healthcare Map...</span>
                </div>
              </div>

              <!-- Map Toolbar Action Controls -->
              <div style="margin-top: 10px; display: flex; gap: 8px; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                <button type="button" class="btn btn--primary btn--sm" style="flex: 1; font-size: 0.78rem;" onclick="window.refreshGeolocation()">
                  📍 Center on My Location
                </button>
                <button type="button" class="btn btn--secondary btn--sm" style="flex: 1; font-size: 0.78rem;" onclick="window.filterOnly24x7()">
                  🟢 24/7 Centers Only
                </button>
              </div>
            </div>

            <!-- Urgent Ambulance Call Reminder -->
            <div class="card card--red" style="border-radius: var(--radius-xl); padding: var(--space-lg); box-shadow: 0 4px 14px rgba(239, 68, 68, 0.15);">
              <div style="display: flex; align-items: flex-start; gap: 10px;">
                <span style="font-size: 1.5rem; flex-shrink: 0;">🚨</span>
                <div>
                  <div style="color: var(--color-danger-dark); font-size: var(--text-xs); font-weight: 800; letter-spacing: var(--tracking-wider);">
                    CANNOT REACH HOSPITAL ON YOUR OWN?
                  </div>
                  <div style="color: var(--color-text-main); font-size: var(--text-sm); font-weight: 700; margin-top: 4px; line-height: 1.35;">
                    Dial 108 for free government ambulance dispatch with on-board paramedic care.
                  </div>
                  <a href="tel:108" class="btn btn--emergency btn--sm btn--full" style="margin-top: 10px; font-weight: 800;">
                    📞 Call 108 Emergency Ambulance Now
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  `;
}
