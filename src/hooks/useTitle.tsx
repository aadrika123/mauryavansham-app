import { useEffect } from 'react';
import { useStore } from '../store';

export default function UseTitle(titleName = '') {
  const { setTitle } = useStore();
  useEffect(() => {
    setTitle(titleName);
  }, [titleName]);

  return null;
}
