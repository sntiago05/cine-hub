// StatsCard.js
// Reusable presentational component that renders a single metric card.
// Used by AdminDashboardPage to display key statistics at a glance.

/**
 * Generates an HTML string representing a statistics metric card.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.title - The label describing the metric (e.g. "Total Users").
 * @param {number|string} props.value - The numeric or string value of the metric.
 * @param {string} props.icon - An HTML/SVG string or emoji representing the metric visually.
 * @returns {string} An HTML template literal string ready to be injected into the DOM.
 */
export function StatsCard({ title, value, icon }) {
  return `
    <div class="
      flex items-center gap-4
      bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      rounded-2xl shadow-sm hover:shadow-md
      transition-shadow duration-300
      p-6 w-full
    ">

      <!-- Icon container -->
      <div class="
        flex items-center justify-center
        w-14 h-14 shrink-0
        bg-indigo-50 dark:bg-indigo-900/30
        text-indigo-600 dark:text-indigo-400
        rounded-xl text-2xl
      ">
        ${icon}
      </div>

      <!-- Text content -->
      <div class="flex flex-col min-w-0">
        <span class="
          text-sm font-medium tracking-wide uppercase
          text-gray-500 dark:text-gray-400
          truncate
        ">
          ${title}
        </span>
        <span class="
          text-3xl font-bold
          text-gray-800 dark:text-gray-100
          leading-tight mt-1
        ">
          ${value ?? "—"}
        </span>
      </div>

    </div>
  `;
}