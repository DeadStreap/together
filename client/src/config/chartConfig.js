// Конфигурация размеров для графиков

export const CHART_SIZES = {
    pie: {
        smallMobile: { width: 260, height: 200, margin: { top: 20, right: 60, bottom: 20, left: 60 } },
        mobile: { width: 300, height: 230, margin: { top: 20, right: 70, bottom: 20, left: 70 } },
        desktop: { width: 350, height: 250, margin: { top: 20, right: 80, bottom: 20, left: 80 } }
    },
    pieLarge: {
        smallMobile: { width: 320, height: 280, margin: { top: 30, right: 60, bottom: 50, left: 60 } },
        mobile: { width: 400, height: 320, margin: { top: 35, right: 70, bottom: 60, left: 70 } },
        desktop: { width: 500, height: 380, margin: { top: 40, right: 80, bottom: 70, left: 80 } }
    },
    bar: {
        smallMobile: { width: 400, height: 300, margin: { top: 20, right: 20, bottom: 90, left: 50 } },
        mobile: { width: 500, height: 340, margin: { top: 20, right: 20, bottom: 95, left: 55 } },
        desktop: { width: 700, height: 420, margin: { top: 20, right: 20, bottom: 100, left: 60 } }
    },
    line: {
        smallMobile: { width: 320, height: 240, margin: { top: 20, right: 20, bottom: 50, left: 50 } },
        mobile: { width: 420, height: 280, margin: { top: 20, right: 25, bottom: 55, left: 55 } },
        desktop: { width: 600, height: 340, margin: { top: 20, right: 30, bottom: 60, left: 60 } }
    }
};

export const BREAKPOINTS = {
    SMALL_MOBILE: 480,
    MOBILE: 768
};

export const getChartSize = (type, windowWidth) => {
    const isSmallMobile = windowWidth < BREAKPOINTS.SMALL_MOBILE;
    const isMobile = windowWidth < BREAKPOINTS.MOBILE;

    const sizes = CHART_SIZES[type];
    if (!sizes) return null;

    if (isSmallMobile) return sizes.smallMobile;
    if (isMobile) return sizes.mobile;
    return sizes.desktop;
};
