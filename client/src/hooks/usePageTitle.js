import { useEffect } from 'react';

const BASE_TITLE = 'Together';

export const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} - ${BASE_TITLE}` : BASE_TITLE;
  }, [title]);
};
