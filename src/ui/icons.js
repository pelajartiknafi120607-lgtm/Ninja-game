const svg = (body, viewBox = '0 0 24 24') =>
  `<svg viewBox="${viewBox}" aria-hidden="true" focusable="false">${body}</svg>`;

export const ICONS = {
  heart: svg(
    '<path d="M12 21.2S3.4 16 3.4 10.1A4.9 4.9 0 0 1 12 6.4a4.9 4.9 0 0 1 8.6 3.7C20.6 16 12 21.2 12 21.2z" fill="currentColor"/>',
  ),
  star: svg(
    '<path d="M12 2.2l2.95 6.35 6.95.82-5.15 4.73 1.4 6.85L12 17.55l-6.15 3.4 1.4-6.85L2.1 9.37l6.95-.82z" fill="currentColor"/>',
  ),
  crown: svg(
    '<path d="M3 7.2l4.6 3.1L12 3.6l4.4 6.7L21 7.2l-1.8 10.1H4.8z" fill="currentColor"/><rect x="4.8" y="18.5" width="14.4" height="2.4" rx="1" fill="currentColor"/>',
  ),
  torii: svg(
    '<path d="M2.6 4.6h18.8v2.2H2.6zM4.4 8.2h15.2v2H4.4zM6.2 10.8h2.4v9.8H6.2zM15.4 10.8h2.4v9.8h-2.4zM9.6 8.6h4.8v2H9.6z" fill="currentColor"/>',
  ),
  city: svg(
    '<path d="M3 21V9.6h4.2V6.4h3.4V3h4.6v6.4h2.6V21zm5.9 0v-3.6h1.8V21zm4.4 0v-3.6h1.8V21z" fill="currentColor"/><path d="M13.2 5h1.2v1.4h-1.2zm0 2.8h1.2v1.4h-1.2zM4.6 12h1.2v1.4H4.6zm0 2.8h1.2v1.4H4.6z" fill="#fff3d6"/>',
  ),
  temple: svg(
    '<path d="M12 2.2l8.4 5.2H3.6zM5.4 8.6h13.2v2.1H5.4zM7 12h10v2H7zM4.6 15.6h14.8v2.1H4.6zM8.4 19h7.2v2.8H8.4z" fill="currentColor"/>',
  ),
  book: svg(
    '<path d="M4 5.2A2.2 2.2 0 0 1 6.2 3H11v18H6.2A2.2 2.2 0 0 1 4 18.8zM13 3h4.8A2.2 2.2 0 0 1 20 5.2v13.6a2.2 2.2 0 0 1-2.2 2.2H13z" fill="currentColor"/><path d="M13 6.2h4.2M13 9.2h4.2" stroke="#fff3d6" stroke-width="1.3" stroke-linecap="round"/>',
  ),
  pencil: svg(
    '<path d="M4 17.4L15.8 5.6l2.6 2.6L6.6 20H4z" fill="currentColor"/><path d="M14.4 4.2l1.8-1.8 3.4 3.4-1.8 1.8z" fill="#fff3d6"/><path d="M4 17.4L6.6 20 3 21z" fill="#fff3d6"/>',
  ),
  orb: svg(
    '<circle cx="12" cy="12" r="6.6" fill="currentColor"/><ellipse cx="12" cy="12" rx="10" ry="3.6" fill="none" stroke="currentColor" stroke-width="1.4" transform="rotate(-28 12 12)"/><circle cx="9.4" cy="9.4" r="1.7" fill="#fff3d6"/>',
  ),
  clock: svg(
    '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 6.4V12l3.8 2.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  ),
  obstacle: svg(
    '<path d="M3 18l4.2-8.2L12 16l4.8-6.2L21 18z" fill="currentColor"/><path d="M3 20.2h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  ),
  target: svg(
    '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/>',
  ),
  play: svg('<path d="M8 5v14l11-7z" fill="currentColor"/>'),
  trophy: svg(
    '<path d="M7 4h10v4.2a5 5 0 0 1-10 0zM5 5h2v3.4A3.4 3.4 0 0 1 3.6 5zm12 0h2v3.4A3.4 3.4 0 0 0 22.4 5z" fill="currentColor"/><path d="M10.6 13h2.8v4h3v2.4H7.6V17h3z" fill="currentColor"/>',
  ),
};

export function icon(name, className = '') {
  const markup = ICONS[name] || ICONS.star;
  return className ? `<span class="${className}">${markup}</span>` : markup;
}

export function difficultyStars(count) {
  return `<span class="difficulty-stars">${Array.from({ length: 3 }, (_, index) =>
    icon('star', index < count ? '' : 'is-dim'),
  ).join('')}</span>`;
}
