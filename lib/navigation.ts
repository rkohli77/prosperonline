export const handleGetStarted = () => {
  // If we're on the home page, just scroll to contact
  if (window.location.pathname === '/') {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    // If we're on another page, navigate to home and then scroll to contact
    window.location.href = '/#contact';
  }
};
