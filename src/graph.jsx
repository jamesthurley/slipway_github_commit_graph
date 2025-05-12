<div style={{ display: "flex", flexDirection: "column", margin: data.margin }}>
  <h2 style={{marginTop: 0, marginBottom: 0}}>{data.totalContributions}</h2>
  <p style={{marginTop: 0, marginBottom: 10}}>Contributions in the last year</p>
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
                if (count === 0) return "#ebedf0";
                if (count < 2) return "#9be9a8";
                if (count < 4) return "#40c463";
                if (count < 6) return "#30a14e";
                return "#216e39";
              })(day.contributionCount),
              borderRadius: 2,
              border: "1px solid #d1d5da",
            }}
          ></div>
        ))}
      </div>
    ))}
  </div>
</div>