
import fswatch from 'node-watch';

fswatch('/Users/livestar/', { recursive: true}, (event, name) => {
  if (name.startsWith('/Users/livestar/Library/Application Support')) {
    return;
  }
  if (name.startsWith('/Users/livestar/Library/')) {
    return;
  }
  console.log('fileChanged-------', event, name);
});
