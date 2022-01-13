module.exports = {
    content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
    // purge: [
    //     './src/**/*.{html,js,ts,jsx,tsx}',
    // ],
    theme: {
        colors: {
            viewport: '#2E2E30',
            dialog: '#111111',
            black: '#000000',
            white: '#ffffff',
            transparent: 'transparent',
            neutral: {
                900: "#191919",
                800: "#202020",
                700: "#272727",
                600: "#363636",
                500: "#484848",
                400: "#6d6d6d",
                300: "#919191",
                200: "#b6b6b6",
                100: "#dadada",
                50: "#e2e2e2",
            },
            accent: {
                50: "#f5f3ff",
                100: "#ede9fe",
                200: "#ddd6fe",
                300: "#c4b5fd",
                400: "#a78bfa",
                500: "#8b5cf6",
                600: "#7c3aed",
                700: "#6d28d9",
                800: "#5b21b6",
                900: "#4c1d95",
            },
            // accent: {
            //     50: "#E3F8FF",
            //     100: "#B3ECFF",
            //     200: "#81DEFD",
            //     300: "#5ED0FA",
            //     400: "#40C3F7",
            //     500: "#2BB0ED",
            //     600: "#1992D4",
            //     700: "#127FBF",
            //     800: "#0B69A3",
            //     900: "#035388"
            // },
            red: {
                50: "#FFE3E3",
                100: "#FFBDBD",
                200: "#FF9B9B",
                300: "#F86A6A",
                400: "#EF4E4E",
                500: "#E12D39",
                600: "#CF1124",
                700: "#AB091E",
                800: "#8A041A",
                900: "#610316"
            },
            green: {
                50: "#EFFCF6",
                100: "#C6F7E2",
                200: "#8EEDC7",
                300: "#65D6AD",
                400: "#3EBD93",
                500: "#27AB83",
                600: "#199473",
                700: "#147D64",
                800: "#0C6B58",
                900: "#014D40"
            }
        },
        extend: {
            minHeight: (theme) => ({
                ...theme('spacing'),
            }),
        }
    },
    plugins: [],
}
