import { HealthcareFacility, FacilityType } from '../types/health';
import { renderHospitalCard } from '../components/HospitalCard';

export function renderCareLocatorPage(facilities: HealthcareFacility[], activeFilter: string, searchQuery: string): string {
  const facilityCardsHtml = facilities
    .map((facility) => renderHospitalCard(facility))
    .join('');

  const filterButtons: { label: string; value: FacilityType | 'ALL' }[] = [
    { label: 'All Centers', value: 'ALL' },
    { label: 'PHC (Primary)', value: 'Primary Health Centre (PHC)' },
    { label: 'CHC (Community)', value: 'Community Health Centre (CHC)' },
    { label: 'District Hospital', value: 'District Hospital' },
    { label: 'Private Clinic', value: 'Private Clinic' },
    { label: '24/7 Pharmacy', value: '24/7 Pharmacy' }
  ];

  const filterChipsHtml = filterButtons
    .map(
      (btn) => `
    <button 
      type="button" 
      class="chip ${activeFilter === btn.value ? 'selected' : ''}" 
      onclick="window.setLocatorFilter('${btn.value}')"
    >
      ${btn.label}
    </button>
  `
    )
    .join('');

  return `
    <div class="page-content">
      <div class="container" style="padding-top: var(--space-lg); padding-bottom: var(--space-3xl);">
        
        <!-- Header -->
        <div style="margin-bottom: var(--space-xl);">
          <div class="badge badge--green" style="margin-bottom: var(--space-sm);">
            <span class="badge-dot badge-dot--pulse"></span>
            HEALTHCARE LOCATOR
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            Find Nearby Medical Centers
          </h1>
          <p class="text-base text-muted">
            Locate verified government and private medical centers, primary health centres, community hospitals, and 24/7 pharmacies.
          </p>
        </div>

        <!-- Search & Filter Controls Bento Card -->
        <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl);">
          <div class="search-bar" style="margin-bottom: var(--space-md);">
            <span style="font-size: 1.2rem; margin-right: 8px;">🔍</span>
            <input 
              type="text" 
              placeholder="Search by Village, Taluka, Town, PIN Code, or Hospital name..." 
              value="${searchQuery}"
              oninput="window.handleLocatorSearch(this.value)"
            />
          </div>

          <div>
            <div style="font-size: var(--text-xs); font-weight: 800; text-transform: uppercase; letter-spacing: var(--tracking-wider); margin-bottom: 8px; color: var(--color-text-muted);">
              Filter by Facility Type:
            </div>
            <div class="chip-group" style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${filterChipsHtml}
            </div>
          </div>
        </div>

        <!-- Map & Facility List Grid -->
        <div class="bento-grid" style="gap: var(--card-gap); align-items: flex-start;">
          
          <!-- Facility List (Left 7 Cols) -->
          <div class="col-span-7" style="display: flex; flex-direction: column; gap: var(--space-md);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <span style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); text-transform: uppercase; color: var(--color-text-main);">
                ${facilities.length} Facilities Found Nearby
              </span>
              <span class="badge badge--green">📍 GPS Active: Pune Rural</span>
            </div>

            ${
              facilityCardsHtml.length > 0
                ? facilityCardsHtml
                : `
              <div class="card card--paper" style="text-align: center; padding: var(--space-2xl); border-radius: var(--radius-xl);">
                <div style="font-size: 3rem; margin-bottom: 12px;">🏥</div>
                <h3 class="text-h4">No facilities match your search</h3>
                <p class="text-muted" style="margin-top: 6px;">Try clearing your search query or selecting "All Centers".</p>
              </div>
            `
            }
          </div>

          <!-- Interactive Map Component (Right 5 Cols) -->
          <div class="col-span-5" style="position: sticky; top: 90px; display: flex; flex-direction: column; gap: var(--space-md);">
            <div class="card card--green" style="border-radius: var(--radius-xl); text-align: center; padding: var(--space-xl);">
              <div style="font-size: 2.8rem; margin-bottom: 8px;">🗺️</div>
              <h4 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); color: var(--color-primary-dark);">Regional Healthcare Radar</h4>
              <p style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 6px;">
                Showing geo-verified medical centers within a 30km radius of your village.
              </p>
              <div style="margin-top: 14px; display: flex; gap: 8px; justify-content: center;">
                <button type="button" class="btn btn--primary btn--sm" onclick="window.refreshGeolocation()">
                  📍 Update GPS Location
                </button>
              </div>
            </div>

            <!-- 108 Direct Hotline reminder -->
            <div class="card card--red" style="border-radius: var(--radius-xl); padding: var(--space-lg);">
              <div style="color: var(--color-danger-dark); font-size: var(--text-xs); font-weight: 800; letter-spacing: var(--tracking-wider);">CANNOT REACH HOSPITAL?</div>
              <div style="color: var(--color-text-main); font-size: var(--text-sm); font-weight: 700; margin-top: 4px;">
                Dial 108 for free government ambulance transport with on-board paramedic.
              </div>
              <a href="tel:108" class="btn btn--emergency btn--sm btn--full" style="margin-top: 12px;">
                📞 Call 108 Ambulance Now
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}
