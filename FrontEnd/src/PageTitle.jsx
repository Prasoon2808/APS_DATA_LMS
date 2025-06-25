import { useEffect } from 'react';

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = `${title} | Edu[LAB]India | Learning Management System`;
  }, [title]);

  return null;
};

export default PageTitle;
