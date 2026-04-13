import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import "@/settings/settings.mutators";
import { setAvatarUrl, setLanguage, setTheme } from "@/settings/settings.actions";
import settingsStore from "@/settings/settings.store";

const AppHeader = observer(() => {
  const { i18n } = useTranslation();
  const settings = settingsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleThemeToggle() {
    const cycle = { system: "light", light: "dark", dark: "system" } as const;
    const next = cycle[settings.theme];
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.classList.toggle("light", next === "light");
    setTheme(next);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <header>
      <span>Elotus</span>
      <div>
        <select
          value={settings.language}
          onChange={(e) => {
            i18n.changeLanguage(e.target.value);
            setLanguage(e.target.value);
          }}
        >
          <option value="en">EN</option>
          <option value="vi">VI</option>
        </select>
        <button type="button" onClick={handleThemeToggle}>
          {settings.theme}
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          {settings.avatarUrl ? (
            <img src={settings.avatarUrl} alt="avatar" width={32} height={32} />
          ) : (
            "avatar"
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
      </div>
    </header>
  );
});

export default AppHeader;
