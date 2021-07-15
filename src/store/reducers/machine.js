const defaultState = {
    printer: null,
    scanner: null,
    isNet: false,
}

export default function (state = defaultState, { type, data }) {
    return ({

        /**
         * 初始化设备
         */
        INIT_DEVICE () {
            const _ = {...state};
            Reflect.ownKeys(data).forEach(k => {
                data[k] !== undefined && data[k] !== undefined && (_[k] = data[k]);
            });
            return _;
        }

    })[type]?.() ?? state;
}