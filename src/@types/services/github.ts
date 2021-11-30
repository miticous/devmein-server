export type GithubProps = {
  getProfileId: (nickname: string) => Promise<string>;
};
