
/**
 * @param {{
 *   width: number,
 *   height: number,
 *   horizontal_padding: number,
 *   vertical_padding: number,
 *   background_color: string,
 *   font_color: string,
 *   day_border_color: string,
 *   day_border_width: number,
 *   day_palette: string[],
 *   username: string,
 *   github_token: string
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
export async function run(input){
  let data = await getGitHubContributions(
    input.github_token || slipway_host.env('GITHUB_TOKEN'),
    input.username,
  );

  const drawMarginWidth = input.horizontal_padding || 10;
  const drawMarginHeight = input.vertical_padding || 10;
  const boxVerticalMargin = 1;
  const boxHorizontalMargin = 3;
  const borderWidth = input.day_border_width || 1;
  const drawWidth = input.width - drawMarginWidth*2;
  const drawHeight = input.height - drawMarginHeight*2;
  const boxWidth = Math.floor(drawWidth / (data.weeks.length + 1)) - borderWidth - boxHorizontalMargin;
  const boxHeight = Math.min(boxWidth, Math.floor(drawHeight / 7) - borderWidth - boxVerticalMargin);

  let jsx = await slipway_host.load_text('', 'graph.jsx');

  data.username = input.username;
  data.horizontalMargin = drawMarginWidth;
  data.verticalMargin = drawMarginHeight;
  data.boxWidth = boxWidth;
  data.boxHeight = boxHeight;
  data.border = `${input.day_border_width || 1}px solid ${input.day_border_color || '#d1d5da'}`;
  data.palette = input.day_palette || [
    '#ebedf0',
    '#9be9a8',
    '#40c463',
    '#30a14e',
    '#216e39',
  ];
  data.backgroundColor = input.background_color || '#ffffff';
  data.fontColor = input.font_color || '#000000';
  
  return {
    data,
    jsx,
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
export async function getGitHubContributions(githubToken, username) {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const from = oneYearAgo.toISOString();
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

