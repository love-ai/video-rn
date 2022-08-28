const HOSTAPI = {
  debug: "https://acpkp3ic6j.ap-northeast-1.awsapprunner.com",
  release: "https://acpkp3ic6j.ap-northeast-1.awsapprunner.com",
};

export function NETWORK_BASE_URL(env) {
  return HOSTAPI[env] || HOSTAPI.release;
}

