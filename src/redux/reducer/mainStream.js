import {
  ADD_USER_INTERACTION,
  REMOVE_USER_INTERACTION,
  TOGGLE_IS_STREAM_PLAYING,
  TOGGLE_SHOW_EMOJI_BASKET,
  SHOW_SNAPSHOT_SHARE_POPUP,
  TOGGLE_IS_BROADCASTING,
  UPDATE_VIEWERS,
} from '../types';

const mockEmojis = [
  {
    items: [
      "https://assets.zoolife.tv/emotes/baskets/b1/hat1.png",
      "https://assets.zoolife.tv/emotes/baskets/b1/hat2.png",
      "https://assets.zoolife.tv/emotes/baskets/b1/hat3.png",
      "https://assets.zoolife.tv/emotes/baskets/b1/hat4.png",
      "https://assets.zoolife.tv/emotes/baskets/b1/hat5.png",
      "https://assets.zoolife.tv/emotes/baskets/b1/btie1.png",
      "https://assets.zoolife.tv/emotes/baskets/b1/crown1.png",
      "https://assets.zoolife.tv/emotes/baskets/b1/crown2.png",
    ],
    _id: "5fca78766fcc2754d59d9f95",
    icon: "https://assets.zoolife.tv/emotes/baskets/tab1.png",
  },
  {
    items: [
      "https://assets.zoolife.tv/emotes/baskets/b2/image 235.png",
      "https://assets.zoolife.tv/emotes/baskets/b2/image 239.png",
      "https://assets.zoolife.tv/emotes/baskets/b2/image 237.png",
      "https://assets.zoolife.tv/emotes/baskets/b2/top-hat_1f3a9 1.png",
      "https://assets.zoolife.tv/emotes/baskets/b2/image 240.png",
      "https://assets.zoolife.tv/emotes/baskets/b2/top-hat_1f3a9 2.png",
      "https://assets.zoolife.tv/emotes/baskets/b2/image 60.png",
      "https://assets.zoolife.tv//image58-1605044847985-1607555168474.png",
    ],
    _id: "5fca78766fcc2754d59d9f96",
    icon: "https://assets.zoolife.tv/emotes/baskets/tab2.png",
  },
  {
    items: [
      "https://assets.zoolife.tv/emotes/baskets/b3/lol.png",
      "https://assets.zoolife.tv/emotes/baskets/b3/cute.png",
      "https://assets.zoolife.tv/emotes/baskets/b3/omg.png",
      "https://assets.zoolife.tv/emotes/baskets/b3/wow.png",
      "https://assets.zoolife.tv/emotes/baskets/b3/fun.png",
      "https://assets.zoolife.tv/emotes/baskets/b3/cool.png",
      "https://assets.zoolife.tv/emotes/baskets/b3/pog.png",
      "https://assets.zoolife.tv/emotes/baskets/b3/xoxo.png",
    ],
    _id: "5fca78766fcc2754d59d9f97",
    icon: "https://assets.zoolife.tv/emotes/baskets/tab3.png",
  },
];

const initialState = {
  userInteractions: [],
  emojis: mockEmojis,
  interactionState: {
    showEmojiBasket: false,
    showSnapshotShare: true,
    isStreamPlaying: false,
    isBroadcasting: false,
  },
  viewers: 0,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_USER_INTERACTION: {
      return {
        ...state,
        userInteractions: [...state.userInteractions, payload],
      }
    }
    case UPDATE_VIEWERS: {
      const { viewers } = payload;
      return {
        ...state,
        viewers,
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
    case TOGGLE_IS_BROADCASTING: {
      return {
        ...state,
        interactionState: {
          ...state.interactionState,
          isBroadcasting: !state.interactionState.isBroadcasting,
        },
      }
    }
    case SHOW_SNAPSHOT_SHARE_POPUP: {
      const { show } = payload
      return {
        ...state,
        interactionState: {
          ...state.interactionState,
          showSnapshotShare: show,
        },
      }
    }
    default: {
      return state;
    }
  }
};
