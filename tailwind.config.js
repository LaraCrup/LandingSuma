export default {
    theme: {
        screens: {
            'sm': '480px',
            'md': '768px',
            'lg': '1080px',
            'xl': '1280px',
            'xxl': '1440px',
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
                'gradient-primary': 'linear-gradient(to bottom, #D7F560, #157A6E)',
                'gradient-primary-horizontal': 'linear-gradient(to right, #D7F560, #157A6E)',
                'gradient-primary-horizontal-reverse': 'linear-gradient(to left, #D7F560, #157A6E)',
                'gradient-secondary': 'linear-gradient(to right, #12534C, #499F68)',
            }
        }
    }
}
