// Students feature barrel export
export { default as StudentList } from './components/StudentList';
export { default as CreateStudent } from './components/CreateStudent';
export { default as UpdateStudent } from './components/UpdateStudent';
export { default as DeleteStudent } from './components/DeleteStudent';

// Re-export slice actions and selectors
export * from './studentsSlice';
