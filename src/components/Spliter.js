import "./Splitter.css";
import React from "react";
function Periods({ periods }) {
  return (
    <ul>
      {periods.map((period) => (
        <li className="ranges" key={`${period.start}-${period.end}`}>
          {period.start} - {period.end}
        </li>
      ))}
    </ul>
  );
}

function Errors({ errors }) {
  return (
    <ul>
      {errors.map((err) => (
        <li className="errors" key={err}>
          {err}
        </li>
      ))}
    </ul>
  );
}

function IntervalSplit(props) {
  const [periods, setPeriods] = React.useState([{ start: 0, end: 100 }]);
  const [formValues, setFormValues] = React.useState({ start: "", end: "" });
  const [errors, setErrors] = React.useState([]);

  const validations = (values) => {
    const err = [];
    if (values.start === null || values.end === null) {
      err.push("Start and End values are required.");
    }
    if (values.start > 99 || values.start < 0) {
      err.push("Invalid start value for period.");
    }
    if (values.end <= 0 || values.end > 100) {
      err.push("Invalid end value for period.");
    }
    if (values.end < values.start) {
      err.push("Start value should be less than End");
    }
    if (values.end === values.start) {
      err.push("Start and End values can not be the same");
    }
    console.log(err);
    return err;
  };

  const split = (newRange) => {
    const newPeriods = [];
    let multiPeriod = null;

    for (let i = 0; i < periods.length; i++) {
      const curPeriod = periods[i];

      //Multibrackets: when the current one expands over two or more current periods.
      if (
        newRange.start >= curPeriod.start &&
        newRange.start < curPeriod.end &&
        newRange.end >= curPeriod.end
      ) {
        if (newRange.start > curPeriod.start) {
          newPeriods.push({ start: curPeriod.start, end: newRange.start - 1 });
        }
        multiPeriod = {
          start: newRange.start,
        };
      }
      if (
        multiPeriod?.start &&
        newRange.start < curPeriod.start &&
        newRange.end < curPeriod.end
      ) {
        multiPeriod.end = newRange.end;
        newPeriods.push(multiPeriod);
        multiPeriod = null;
        if (newRange.end < curPeriod.end) {
          newPeriods.push({ start: newRange.end + 1, end: curPeriod.end });
        }
      }

      // If the range doesn't belong to the current one, leaves the period as it is.
      if (
        !multiPeriod?.start &&
        (newRange.start >= curPeriod.end || newRange.end <= curPeriod.start)
      ) {
        newPeriods.push(curPeriod);
      }
      // When the new periods falls into an existing bracket.
      if (
        !multiPeriod?.start &&
        newRange.start >= curPeriod.start &&
        newRange.end <= curPeriod.end
      ) {
        if (
          newRange.start < curPeriod.end &&
          newRange.start !== curPeriod.start
        ) {
          newPeriods.push({ start: curPeriod.start, end: newRange.start - 1 });
        }
        if (newRange.end < curPeriod.end) {
          newPeriods.push({ start: newRange.start, end: newRange.end });
          newPeriods.push({ start: newRange.end + 1, end: curPeriod.end });
        }
        if (newRange.end === curPeriod.end) {
          newPeriods.push({ start: newRange.start, end: newRange.end });
        }
      }
    }
    return newPeriods;
  };

  const submit = (e) => {
    e.preventDefault();
    setErrors([]);
    const err = validations(formValues);
    if (err.length > 0) {
      setErrors(err);
    } else {
      const newPeriods = split(formValues);
      setPeriods(newPeriods);
    }
  };

  const onChange = (e) => {
    const vals = { ...formValues };
    vals[e.target.name] = parseInt(e.target.value, 10);
    setFormValues(vals);
  };

  return (
    <div className="interval-split">
      <form className="form" onSubmit={submit}>
        <label className="field">
          Start:{" "}
          <input
            id="start"
            name="start"
            type="number"
            value={formValues.start}
            onChange={onChange}
          />
        </label>
        <label className="field">
          End:{"   "}
          <input
            id="end"
            name="end"
            type="number"
            value={formValues.end}
            onChange={onChange}
          />
        </label>
        <button className="button">Split</button>
      </form>
      {errors.length > 0 && <Errors errors={errors} />}
      <Periods periods={periods} />
    </div>
  );
}

export default IntervalSplit;
