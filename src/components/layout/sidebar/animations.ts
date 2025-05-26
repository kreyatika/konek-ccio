
// Animation and variant definitions for the sidebar

// Sidebar animation variants
export const sidebarVariants = {
  open: {
    width: "15rem"
  },
  closed: {
    width: "3.5rem"
  }
};

export const contentVariants = {
  open: {
    display: "block",
    opacity: 1
  },
  closed: {
    display: "block",
    opacity: 1
  }
};

export const itemVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: {
        stiffness: 1000,
        velocity: -100
      }
    }
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: {
        stiffness: 100
      }
    }
  }
};

export const staggerVariants = {
  open: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.02
    }
  }
};

export const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2
};
