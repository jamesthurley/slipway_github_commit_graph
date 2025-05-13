<div style={{ 
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    paddingLeft: data.horizontalMargin,
    paddingRight: data.horizontalMargin,
    paddingTop: data.verticalMargin,
    paddingBottom: data.verticalMargin,
    background: data.backgroundColor,
    }}>
  <h2 style={{marginTop: 0, marginBottom: 0, color: data.fontColor}}>{data.totalContributions}</h2>
  <p style={{marginTop: 0, marginBottom: 10, color: data.fontColor}}>Contributions in the last year</p>
  <div style={{ display: "flex", flexDirection: "row"}}>
    {data.weeks.map((week, weekIdx) => (
      <div
        key={weekIdx}
        style={{
          display: "flex",
          flexDirection: "column",
          marginRight: 2,
        }}
      >
        {week.contributionDays.map((day, dayIdx) => (
          <div
            key={dayIdx}
            title={`${day.date}: ${day.contributionCount} contributions`}
            style={{
              width: data.boxWidth,
              height: data.boxHeight,
              margin: 1,
              background: ((count) => {
                let paletteIndex = Math.floor(count / 2);
                if (paletteIndex >= data.palette.length) {
                  return data.palette[data.palette.length - 1];
                }
                return data.palette[paletteIndex];
              })(day.contributionCount),
              borderRadius: 2,
              border: data.border,
            }}
          ></div>
        ))}
      </div>
    ))}
  </div>
</div>