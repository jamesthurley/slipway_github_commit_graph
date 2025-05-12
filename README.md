# `jamesthurley.github_commit_graph`

A [Slipway](https://slipway.co/) Component which uses a renders your last year
of GitHub contributions as a commit graph.

The output is a rendered commit graph as a canvas.

## Suggested Permissions

### `--allow-http-prefix "https://api.github.com/"`

This component will need to access the GitHub API to fetch your data.

### `--allow-env-exact "GITHUB_TOKEN"`

This component will require access to a GitHub Personal Access Token with sufficient permissions.

Alternatively you can supply the Github Personal Access Token as part of the input
using the `githubToken` properties.

### `--allow-fonts`

This component uses the [`slipwayhq.jsx` Component](https://github.com/slipwayhq/slipway_jsx) component 
to render the commit graph, which requires fonts to render text.

### `--allow-registry-components`

This component uses the [`slipwayhq.jsx` Component](https://github.com/slipwayhq/slipway_jsx) component,
which itself loads other components, to render the chart.

## Example Usage

Test the component by running the following command and pasting in the input when prompted:
```
slipway run-component "jamesthurley.github_commit_graph.1.0.0" --allow-http-prefix "https://api.github.com/" --allow-fonts --allow-registry-components
```

Input:
```json
{
  "width": 800,
  "height": 190,
  "margin": 22,
  "username": "<some_github_username>",
  "githubToken": "<your_github_personal_access_token>"
}
```

Output:
```json
{
  "canvas": {
    "data": "<encoded_rgba_bytes_omitted>",
    "width": 400,
    "height": 300
  }
}
```

![Example Output](example-output.png)