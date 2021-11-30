import { ApolloError } from 'apollo-server-errors';
import axios from 'axios';
import errorMessages from 'constants/errorMessages';
import { GithubProps } from 'types/services/github';

const getTimelineQuery = (nickname: string) => `query {
    user(login: "${nickname}") {
      id
      email
    }
  }
`;

const github: GithubProps = {
  getProfileId: async nickname => {
    const { data }: { data: { data: { user: { id: string } } } } = await axios({
      method: 'post',
      url: process.env.API_GITHUB_URL,
      data: { query: getTimelineQuery(nickname) },
      headers: {
        authorization: `Bearer ${process.env.API_GITHUB_TOKEN}`
      }
    });

    const _data = data.data;

    if (_data?.user) {
      return _data.user.id;
    }

    throw new ApolloError(errorMessages.GITHUB_USER_NOT_FOUND);
  }
};

export default github;
