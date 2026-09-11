import { HealthcareFacility } from '../types/health';

export function renderHospitalCard(facility: HealthcareFacility): string {
  const is24x7 = facility.isOpen24x7;
  const tagClass = is24x7 ? 'badge--green' : 'badge--paper';
  const tagText = is24x7 ? '🟢 24/7 OPEN' : '🕒 8 AM – 8 PM';

  return `
    <div class="hospital-card" id="facility-${facility.id}">
      <div class="hospital-card__header">
        <div>
          <h3 class="hospital-card__name">${facility.name}</h3>
          <div class="hospital-card__type">${facility.type}</div>
        </div>
        <span class="badge ${tagClass}">${tagText}</span>
      </div>

      <div style="font-size: var(--text-sm); color: var(--color-text-muted);">
        📍 ${facility.address}
      </div>

      <div class="hospital-card__meta">
        <span class="hospital-card__distance">🚗 ${facility.distanceKm} km away</span>
        ${facility.hasAmbulance ? '<span class="badge badge--black">🚑 Ambulance On-Site</span>' : ''}
        ${facility.hasEmergencyBed ? '<span class="badge badge--red">🛏️ Emergency Beds</span>' : ''}
      </div>

      <div class="hospital-card__actions">
        <a href="tel:${facility.phone.replace(/[^0-9+]/g, '')}" class="btn btn--primary btn--sm" style="flex: 1;">
          📞 Call Facility
        </a>
        <button class="btn btn--secondary btn--sm" style="flex: 1;" onclick="window.openDirections('${facility.name}', '${facility.address}')">
          🧭 Directions
        </button>
      </div>
    </div>
  `;
}
