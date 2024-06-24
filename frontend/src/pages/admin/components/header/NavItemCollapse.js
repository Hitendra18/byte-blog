import { useEffect, useState } from "react";

const NavItemCollapse = ({
  children,
  title,
  icon,
  name,
  activeNavName,
  setActiveNavName,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (activeNavName !== name) {
      setIsChecked(false);
    }
  }, [setActiveNavName, name, activeNavName]);

  return (
    <div className="collapse collapse-arrow bg-base-200 min-h-0 rounded-none">
      <input
        type="checkbox"
        className="min-h-0 py-2"
        checked={name === activeNavName}
        onChange={() => {
          setActiveNavName(name);
          setIsChecked((value) => !value);
        }}
      />
      <div
        className={`collapse-title text-lg font-medium min-h-0 my-[-8px] pl-0 gap-x-2 flex items-center ${name === activeNavName ? "font-bold text-primary" : "font-semibold text-[#A5A5A5]"}`}
      >
        {icon}
        {title}
      </div>
      <div className="collapse-content">
        <div className="mt-2 flex flex-col gap-y-2">{children}</div>
      </div>
    </div>
  );
};
export default NavItemCollapse;
