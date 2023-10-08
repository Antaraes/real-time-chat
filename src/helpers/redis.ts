const uptstahRedisRestURL = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(command: Command, ...args: (string | number)[]) {
  const commandUrl = `${uptstahRedisRestURL}/${command}/${args.join("/")}`;
  const respone = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
    },
    cache: "no-store",
  });
  if (!respone.ok) {
    throw new Error(`Error executing Redi command: ${respone.statusText}`);
  }
  const data = await respone.json();
  return data.result;
}
