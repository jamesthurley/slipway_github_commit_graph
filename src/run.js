
/**
 * @param {{
 *   width: number,
 *   height: number,
 *   username: string,
 *   github_token: string,
 *   weeks: number,
 *   theme: {
 *     horizontal_padding: number,
 *     vertical_padding: number,
 *     background_color: string,
 *     font_color: string,
 *     day_border_color: string,
 *     day_border_width: number,
 *     day_palette: string[],
 *     count_font_size: number,
 *     description_font_size: number,
 *   }
 * }} input 
 * @returns {Promise<{
 *   data:{
 *     username: string,
 *     margin: string,
 *     boxWidth: number,
 *     boxHeight: number,
 *     border: string,
 *     palette: string[],
 *     totalContributions: number,
 *     weeks: {
 *       contributionDays: {
 *         date: string,
 *         contributionCount: number
 *       }[]
 *     }[],
 *   jsx: string,
 * }>}
 */
export async function run(input) {
  let weeks = input.weeks || 52;
  let data = await getGitHubContributions(
    input.github_token || slipway_host.env('GITHUB_TOKEN'),
    input.username,
    weeks,
  );

  let theme = input.theme || {};

  const drawMarginWidth = theme.horizontal_padding || 10;
  const drawMarginHeight = theme.vertical_padding || 10;
  const boxVerticalMargin = 1;
  const boxHorizontalMargin = 3;
  const borderWidth = theme.day_border_width || 1;
  const drawWidth = input.width - drawMarginWidth * 2;
  const drawHeight = input.height - drawMarginHeight * 2;
  const boxWidth = Math.floor(drawWidth / (data.weeks.length + 1)) - borderWidth - boxHorizontalMargin;
  const boxHeight = Math.min(boxWidth, Math.floor(drawHeight / 7) - borderWidth - boxVerticalMargin);

  let jsx = await slipway_host.load_text('', 'graph.jsx');
  let utils_js = await slipway_host.load_text('', 'utils.js');

  data.username = input.username;
  data.horizontalMargin = drawMarginWidth;
  data.verticalMargin = drawMarginHeight;
  data.boxWidth = boxWidth;
  data.boxHeight = boxHeight;
  data.border = `${theme.day_border_width || 1}px solid ${theme.day_border_color || '#d1d5da'}`;
  data.palette = theme.day_palette || [
    '#ebedf0',
    '#9be9a8',
    '#40c463',
    '#30a14e',
    '#216e39',
  ];
  data.backgroundColor = theme.background_color || '#ffffff';
  data.fontColor = theme.font_color || '#000000';
  data.weekCount = weeks;
  data.countFontSize = input.theme.count_font_size || 26;
  data.descriptionFontSize = input.theme.description_font_size || 16;

  return {
    data,
    jsx,
    utils_js,
  }
}

/**
 * Fetches a user's GitHub “green‑square” data.
 *
 * @param {string} githubToken
 * @param {string} username
 * @returns {Promise<{
 *   totalContributions: number,
 *   weeks: {
 *     contributionDays: {
 *       date: string,
 *       contributionCount: number
 *     }[]
 *   }[]
 * }>}
 */
export async function getGitHubContributions(githubToken, username, weeks) {
  const today = new Date();
  const weeksAgo = new Date(today);
  weeksAgo.setDate(today.getDate() - weeks * 7);

  const from = weeksAgo.toISOString();
  const to = today.toISOString();

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await slipway_host.fetch_text('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${githubToken}`,
    },
    body: JSON.stringify({
      query,
      variables: { username, from, to },
    }),
  });

  const parsedResult = JSON.parse(response.body);
  const result = parsedResult
    .data
    .user
    .contributionsCollection
    .contributionCalendar;

  return result;
}

