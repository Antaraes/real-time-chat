import { Redis } from "@upstash/redis";

export const db = new Redis({
  url: "https://apn1-witty-dogfish-33715.upstash.io",
  token:
    "AYOzASQgODY1Njg5ZDgtZjBlYi00ZjBlLWI2MDMtZGQ0NzE1MTRhNGVhMWY4NTZkNGUzZTM4NDA2ZDhiNGMzZGRlNjk4OTA4NDk=",
});
