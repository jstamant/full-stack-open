# Data for Countries

This is a project made for part 2 of [Full Stack Open](https://fullstackopen.com/en/part2).

## Weather Data

In order for the weather data from [Open
Weather](https://openweathermap.org/) to work, you must set the
`VITE_WEATHER_KEY` environment variable.

You can run the following command to support it:

```sh
export VITE_WEATHER_KEY={yourkey} && npm run dev
```

Or you can create the `.env.local` file in the root of this Vite project:

```sh
VITE_WEATHER_KEY={yourkey}
```
