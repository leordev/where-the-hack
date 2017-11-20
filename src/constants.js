import envs from '../env'

export const LATITUDE_DELTA = 0.0622
export const LONGITUDE_DELTA = 0.0321
export const GC_USER_ID = 'dfwth-user-id'
export const GC_AUTH_TOKEN = 'dfwth-auth-token'
export const GC_START_PAGE = 'Map'
export const MAX_MARKERS_ON_SCREEN = 50
export const LATE_CANCEL_MINS = 15
export const AWS_S3_ACCESS_KEY = envs.AWS_S3_ACCESS_KEY
export const AWS_S3_SECRET_KEY = envs.AWS_S3_SECRET_KEY
export const AWS_S3_PROFILE_PICS = 'profile-pics/'
export const AWS_S3_PLACE_PICS = 'place-pics/'
export const AWS_S3_BUCKET = 'where-the-hack'
export const AWS_S3_REGION = 'us-east-1'
export const TYPE_HOMEOFFICE = 'cja4vsp2o6pj80180r9f70zr6'

export const COLORS = {
    GREEN: '#4CAF50',
    ORANGE: '#FF9800',
    RED: '#F44336',
    BLUE: '#2196F3',
    GREY: '#9e9e9e',
    GREY_LIGHTEN_1: '#BDBDBD',
    GREY_LIGHTEN_3: '#eeeeee',
    GREY_DARKEN_1: '#757575',
    GREY_DARKEN_3: '#424242',
    YELLOW: '#ffeb3b',
    YELLOW_LIGHTEN_3: '#fff59d',
}

export const PLACE_ICON = {
    cj9napim8txc401056ninigyx: {
        name: 'Home Offices',
        color: COLORS.GREEN,
        icon: 'home'
    },
    cj9naoan0u8su010408y2ozs2: {
        name: 'Schools and Libraries',
        color: COLORS.ORANGE,
        icon: 'school'
    },
    cj9nao382txbu0105flc9xp3g: {
        name: 'Cowork Spaces',
        color: COLORS.RED,
        icon: 'work'
    },
    cj9nanjo7u8sk0104kebm46ts: {
        name: 'Coffee Shops and Stores',
        color: COLORS.BLUE,
        icon: 'local-cafe'
    },
    cja4vsp2o6pj80180r9f70zr6: {
        name: 'Home Offices',
        color: COLORS.GREEN,
        icon: 'home'
    },
    cja4vsz7n6q4m0180eayq55lp: {
        name: 'Schools and Libraries',
        color: COLORS.ORANGE,
        icon: 'school'
    },
    cja4vt3lx6qbj0180em6k2cq7: {
        name: 'Coworking Spaces',
        color: COLORS.RED,
        icon: 'work'
    },
    cja4vt7qq6qir0180twjych3k: {
        name: 'Coffee Shops and Stores',
        color: COLORS.BLUE,
        icon: 'local-cafe'
    },
}