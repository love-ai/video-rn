const HOSTAPI = {
  debug: "http://127.0.0.1:8080",
  release: "https://acpkp3ic6j.ap-northeast-1.awsapprunner.com",
};

export function NETWORK_BASE_URL(env) {
  return HOSTAPI[env] || HOSTAPI.release;
}

