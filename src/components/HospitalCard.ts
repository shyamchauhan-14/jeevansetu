import { HealthcareFacility } from '../types/health';

export function renderHospitalCard(facility: HealthcareFacility): string {
  const is24x7 = facility.isOpen24x7;
  const tagClass = is24x7 ? 'badge--green' : 'badge--paper';
  const tagText = is24x7 ? '🟢 24/7 OPEN' : '🕒 8 AM – 8 PM';

  const servicesHtml = facility.services
    ? facility.services
        .slice(0, 4)
        .map((s) => `<span class="badge badge--paper" style="font-size: 0.7rem; padding: 2px 8px;">${s}</span>`)
        .join(' ')
    : '';

  return `
    <div class="hospital-card" id="facility-${facility.id}" style="border-radius: var(--radius-xl); padding: var(--space-lg); background: var(--color-surface); border: 1px solid var(--color-gray-200);">
      <div class="hospital-card__header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
        <div>
          <h3 class="hospital-card__name" style="font-size: var(--text-base); font-weight: var(--font-weight-bold);">${facility.name}</h3>
          <div class="hospital-card__type" style="font-size: var(--text-xs); color: var(--color-text-muted);">${facility.type}</div>
        </div>
        <span class="badge ${tagClass}">${tagText}</span>
      </div>

      <div style="font-size: var(--text-sm); color: var(--color-text-body); margin: 6px 0;">
        📍 ${facility.address}
      </div>

      <!-- Provenance & Verification Disclosure -->
      <div style="font-size: var(--text-2xs); color: var(--color-text-muted); background: var(--color-canvas); padding: 4px 8px; border-radius: var(--radius-xs); margin-bottom: 6px;">
        🏛️ <strong>Source:</strong> ${facility.source || 'District Health Portal'} • <strong>Verified:</strong> ${facility.verifiedDate || 'Recent'}
      </div>

      ${servicesHtml ? `<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">${servicesHtml}</div>` : ''}

      <div class="hospital-card__meta" style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 12px;">
        <span class="hospital-card__distance" style="font-weight: 600; font-size: var(--text-xs);">🚗 ${facility.distanceKm} km away</span>
        ${facility.hasAmbulance ? '<span class="badge badge--black" style="font-size: 0.72rem;">🚑 Ambulance Available</span>' : ''}
        ${facility.hasEmergencyBed ? '<span class="badge badge--red" style="font-size: 0.72rem;">🛏️ Emergency Beds</span>' : ''}
      </div>

      <div class="hospital-card__actions" style="display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="tel:${facility.phone.replace(/[^0-9+]/g, '')}" class="btn btn--primary btn--sm" style="flex: 1;" onclick="window.recordDialerOpened('${facility.phone}')">
          📞 Call Facility
        </a>
        <button type="button" class="btn btn--secondary btn--sm" style="flex: 1;" onclick="window.openDirections('${facility.name}', '${facility.address}')">
          🧭 Directions
        </button>
        <button type="button" class="btn btn--ghost btn--sm" style="font-size: 0.72rem; color: var(--color-text-muted);" onclick="window.openFacilityCorrection('${facility.id}', '${facility.name}')" title="Report outdated info">
          🚩 Report Issue
        </button>
      </div>
    </div>
  `;
}
