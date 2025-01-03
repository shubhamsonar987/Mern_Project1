import React from "react";
import PropTypes from "prop-types";
import styles from "./themechanger.module.css";

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className={styles.themeToggle}>
      <label className={styles.switch}>
        <input type="checkbox" checked={!isDarkMode} onChange={toggleTheme} />
        <span className={styles.slider}></span>
      </label>
    </div>
  );
};

ThemeToggle.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default ThemeToggle;
