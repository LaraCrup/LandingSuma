export default {
    theme: {
        screens: {
            'sm': '480px',
            'tab': '600px',
            'md': '768px',
            'mdlg': '992px',
            'lg': '1080px',
            'xl': '1280px',
            'xxl': '1440px',
            'short': { 'raw': '(max-height: 860px)' },
        },
        extend: {
            fontFamily: {
                heading: ['"Montserrat Alternates"', 'sans-serif'],
                body:    ['Quicksand', 'sans-serif'],
            },
            colors: {
                primary: "#157A6E",
                accent: "#D7F560",
                green: {
                    light: "#499F68",
                    dark: "#12534C"
                },
                light: '#F3FCF7',
                midlight: "#E9F3ED",
                dark: "#131815",
                gray: "#999999",
                error: "#C24848",
            },
            backgroundImage: {
                'gradient-secondary': 'linear-gradient(to right, #12534C, #499F68)',
            }
        }
    }
}
