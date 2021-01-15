import {
  ADD_USER_INTERACTION,
  REMOVE_USER_INTERACTION,
  TOGGLE_IS_STREAM_PLAYING,
  TOGGLE_SHOW_EMOJI_BASKET,
} from '../types';

const mockEmojis = [
  {
    items: [
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b1/hat1.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b1/hat2.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b1/hat3.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b1/hat4.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b1/hat5.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b1/btie1.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b1/crown1.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b1/crown2.png",
    ],
    _id: "5fca78766fcc2754d59d9f95",
    icon: "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/tab1.png",
  },
  {
    items: [
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b2/image 235.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b2/image 239.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b2/image 237.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b2/top-hat_1f3a9 1.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b2/image 240.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b2/top-hat_1f3a9 2.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b2/image 60.png",
      "https://nbt-photos.s3.amazonaws.com/assets/image58-1605044847985-1607555168474.png",
    ],
    _id: "5fca78766fcc2754d59d9f96",
    icon: "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/tab2.png",
  },
  {
    items: [
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b3/lol.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b3/cute.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b3/omg.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b3/wow.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b3/fun.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b3/cool.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b3/pog.png",
      "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/b3/xoxo.png",
    ],
    _id: "5fca78766fcc2754d59d9f97",
    icon: "https://brizi-sandbox-bucket.s3.amazonaws.com/twitch/emotes/baskets/tab3.png",
  },
];

const initialState = {
  userInteractions: [],
  emojis: mockEmojis,
  channelId: '58347159',
  interactionState: {
    showEmojiBasket: false,
    isStreamPlaying: false,
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_USER_INTERACTION: {
      return {
        ...state,
        userInteractions: [...state.userInteractions, payload],
      }
    }

    case REMOVE_USER_INTERACTION: {
      return {
        ...state,
        userInteractions: state.userInteractions.slice(1),
      }
    }

    case TOGGLE_SHOW_EMOJI_BASKET: {
      return {
        ...state,
        interactionState: {
          ...state.interactionState,
          showEmojiBasket: !state.interactionState.showEmojiBasket,
        },
      }
    }
    case TOGGLE_IS_STREAM_PLAYING: {
      return {
        ...state,
        interactionState: {
          ...state.interactionState,
          isStreamPlaying: !state.interactionState.isStreamPlaying,
        },
      }
    }
    default: {
      return state;
    }
  }
};
