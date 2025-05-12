
/**
 * @param {{
 *   width: number,
 *   height: number,
 *   margin: number,
 *   username: string,
 *   githubToken: string
 * }} input 
 * @returns {Promise<{
 *   data:{
 *     boxWidth: number,
 *     boxHeight: number,
 *     username: string,
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
    input.githubToken || slipway_host.env('GITHUB_TOKEN'),
    input.username,
  );

  const drawMarginWidth = input.margin || 10;
  const boxVerticalMargin = 1;
  const boxHorizontalMargin = 3;
  const borderWidth = 1;
  const drawWidth = input.width - drawMarginWidth*2;
  const drawHeight = input.height - drawMarginWidth*2;
  const boxWidth = Math.floor(drawWidth / (data.weeks.length + 1)) - borderWidth - boxHorizontalMargin;
  const boxHeight = Math.min(boxWidth, Math.floor(drawHeight / 7) - borderWidth - boxVerticalMargin);

  let jsx = await slipway_host.load_text('', 'graph.jsx');

  data.username = input.username;
  data.margin = drawMarginWidth;
  data.boxWidth = boxWidth;
  data.boxHeight = boxHeight;
  
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

