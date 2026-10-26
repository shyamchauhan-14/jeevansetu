import { renderNavbar } from '../components/Navbar';
import { renderFooter } from '../components/Footer';
import { renderBottomNavigation } from '../components/BottomNavigation';
import { renderOfflineBanner } from '../components/OfflineBanner';

export function renderAppLayout(currentPath: string, pageHtml: string, isOffline = false): string {
  return `
    <div class="app-canvas">
      <a href="#main-content" class="skip-link">Skip to main content</a>
      
      ${isOffline ? renderOfflineBanner() : ''}
      
      ${renderNavbar(currentPath)}
      
      <main id="main-content" tabindex="-1">
        ${pageHtml}
      </main>
      
      ${renderFooter()}
      
      ${renderBottomNavigation(currentPath)}
    </div>
  `;
}
