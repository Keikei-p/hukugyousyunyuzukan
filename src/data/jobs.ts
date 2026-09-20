import data from './jobs.json';
export const jobs = data.filter(job => job.status === 'published');
