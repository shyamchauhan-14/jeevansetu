import { HealthcareFacility, FacilityType } from '../types/health';
import { renderHospitalCard } from '../components/HospitalCard';
import { HealthcareService } from '../services/healthcareService';
import { I18nService } from '../services/i18nService';

export function renderCareLocatorPage(facilities: HealthcareFacility[], activeFilter: string, searchQuery: string): string {
  const facilityCardsHtml = facilities
    .map((facility) => renderHospitalCard(facility))
    .join('');

  const cachedFacilities = HealthcareService.getRecentlyViewedFacilities();

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
            ${I18nService.t('locator.badge', 'HEALTHCARE FACILITY FINDER')}
          </div>
          <h1 class="text-h1" style="line-height: 1.15; margin-bottom: var(--space-xs);">
            ${I18nService.t('locator.title', 'Find Verified Healthcare Centers')}
          </h1>
          <p class="text-base text-muted">
            ${I18nService.t('locator.subtitle', 'Locate nearest PHCs, CHCs, sub-district hospitals, and 24/7 pharmacies with verified phone numbers.')}
          </p>
        </div>

        <!-- Search & Filter Controls Bento Card -->
        <div class="card card--paper" style="margin-bottom: var(--space-xl); border-radius: var(--radius-xl);">
          <div class="search-bar" style="margin-bottom: var(--space-md);">
            <span style="font-size: 1.2rem; margin-right: 8px;">🔍</span>
            <input 
              type="text" 
              placeholder="${I18nService.t('locator.searchPlaceholder', 'Search by Village, Taluka, Town, PIN Code, or Hospital name...')}" 
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

        <!-- Correction Report Dialog (Hidden by default) -->
        <div id="correction-dialog" class="card card--paper" style="display: none; border-left: 5px solid var(--color-warning); border-radius: var(--radius-xl); margin-bottom: var(--space-xl); padding: var(--space-lg);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <h3 style="font-size: var(--text-base); font-weight: bold; color: var(--color-warning-dark);">🚩 Flag Outdated Facility Information</h3>
            <button type="button" class="btn btn--ghost btn--sm" onclick="window.closeFacilityCorrection()">✕</button>
          </div>
          <form onsubmit="window.submitFacilityCorrection(event)">
            <input type="hidden" id="correction-facility-id" />
            <div style="font-size: var(--text-sm); font-weight: 600; margin-bottom: 8px;" id="correction-facility-title">Facility</div>
            <div class="grid grid--2" style="margin-bottom: 8px;">
              <div class="input-wrap">
                <label class="input-label" for="correction-issue-type" style="font-size: var(--text-xs);">Issue Type</label>
                <select id="correction-issue-type" class="select">
                  <option value="wrong_phone">Incorrect Phone Number</option>
                  <option value="closed">Facility Closed or Relocated</option>
                  <option value="address_incorrect">Incorrect Address / Location</option>
                  <option value="services_changed">Services Not Available</option>
                </select>
              </div>
              <div class="input-wrap">
                <label class="input-label" for="correction-details" style="font-size: var(--text-xs);">Correction Details</label>
                <input type="text" id="correction-details" class="input" placeholder="e.g. New contact number is +91..." required />
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 8px;">
              <button type="button" class="btn btn--ghost btn--sm" onclick="window.closeFacilityCorrection()">Cancel</button>
              <button type="submit" class="btn btn--primary btn--sm">Submit Correction</button>
            </div>
          </form>
        </div>

        <!-- Map & Facility List Grid -->
        <div class="bento-grid" style="gap: var(--card-gap); align-items: flex-start;">
          
          <!-- Facility List (Left 7 Cols) -->
          <div class="col-span-7" style="display: flex; flex-direction: column; gap: var(--space-md);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <span style="font-weight: var(--font-weight-bold); font-size: var(--text-sm); text-transform: uppercase; color: var(--color-text-main);">
                ${facilities.length} Verified Facilities Found
              </span>
              <span class="badge badge--green">📍 Verified Registry: Pune Rural Sector</span>
            </div>

            ${
              facilityCardsHtml.length > 0
                ? facilityCardsHtml
                : `
              <div class="card card--paper" style="text-align: center; padding: var(--space-2xl); border-radius: var(--radius-xl);">
                <div style="font-size: 3rem; margin-bottom: 12px;">🏥</div>
                <h3 class="text-h4">No facilities match your search</h3>
                <p class="text-muted" style="margin-top: 6px;">Try searching by broad taluka name (e.g. Khed, Manchar, Junnar) or selecting "All Centers".</p>
              </div>
            `
            }

            ${
              cachedFacilities.length > 0
                ? `
              <div class="card card--paper" style="border-radius: var(--radius-xl); padding: var(--space-md); margin-top: var(--space-lg);">
                <div style="font-size: var(--text-xs); font-weight: bold; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 6px;">
                  Recently Viewed Facilities (Offline Cached)
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  ${cachedFacilities
                    .slice(0, 3)
                    .map(
                      (cf) => `
                    <div style="font-size: var(--text-xs); display: flex; justify-content: space-between;">
                      <span>🏥 ${cf.name} (${cf.type})</span>
                      <span class="text-muted">${cf.cachedAt ? new Date(cf.cachedAt).toLocaleDateString() : 'Cached'}</span>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>
            `
                : ''
            }
          </div>

          <!-- Interactive Map / Locator Info (Right 5 Cols) -->
          <div class="col-span-5" style="position: sticky; top: 90px; display: flex; flex-direction: column; gap: var(--space-md);">
            <div class="card card--green" style="border-radius: var(--radius-xl); text-align: center; padding: var(--space-xl);">
              <div style="font-size: 2.8rem; margin-bottom: 8px;">🗺️</div>
              <h4 style="font-size: var(--text-h5); font-weight: var(--font-weight-bold); color: var(--color-primary-dark);">Rural Health Radar</h4>
              <p style="font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 6px;">
                Verified government health facilities and licensed 24/7 pharmacies across Khed, Manchar, and Junnar sub-districts.
              </p>
              <div style="margin-top: 14px; display: flex; gap: 8px; justify-content: center;">
                <button type="button" class="btn btn--primary btn--sm" onclick="window.refreshGeolocation()">
                  📍 Update GPS Location
                </button>
              </div>
            </div>

            <!-- Direct 108 Emergency Call -->
            <div class="card card--red" style="border-radius: var(--radius-xl); padding: var(--space-lg);">
              <div style="color: var(--color-danger-dark); font-size: var(--text-xs); font-weight: 800; letter-spacing: var(--tracking-wider);">NEED TRANSPORT TO HOSPITAL?</div>
              <div style="color: var(--color-text-main); font-size: var(--text-sm); font-weight: 700; margin-top: 4px;">
                Dial 108 for free government ambulance transport with trained on-board paramedic.
              </div>
              <a href="tel:108" class="btn btn--emergency btn--sm btn--full" style="margin-top: 12px;" onclick="window.recordDialerOpened('108')">
                📞 Call 108 Ambulance Now
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}
