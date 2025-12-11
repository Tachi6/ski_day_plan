import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { SkiPlanning } from './SkiPlanning';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SkiPlanning />
  </StrictMode>
);
