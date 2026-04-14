import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MoonIcon, SunIcon, UserIcon } from "lucide-react";
import "@/styles/components/AppHeader.css";
import "@/settings/settings.mutators";
import { setAvatarUrl, setLanguage, setTheme } from "@/settings/settings.actions";
import settingsStore from "@/settings/settings.store";

const AppHeader = observer(() => {
  const { i18n } = useTranslation();
  const settings = settingsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleThemeToggle() {
    const next = settings.theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", next === "dark");
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
    <header className="app-header">
      <div className="app-header__container container">
        <Link to="/" className="text-base font-semibold tracking-tight">Elotus</Link>

        <div className="app-header__controls">
          <select
            value={settings.language}
            onChange={(e) => {
              i18n.changeLanguage(e.target.value);
              setLanguage(e.target.value);
            }}
            className="app-header__lang-select"
          >
            <option value="en">EN</option>
            <option value="vi">VI</option>
          </select>

          <button type="button" onClick={handleThemeToggle} className="app-header__theme-btn">
            {settings.theme === "dark" ? (
              <MoonIcon className="size-4" />
            ) : (
              <SunIcon className="size-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="app-header__avatar-btn"
          >
            {settings.avatarUrl ? (
              <img src={settings.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <UserIcon className="size-4 text-muted-foreground" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>
    </header>
  );
});

export default AppHeader;
