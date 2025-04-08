const SettingsList = ({ settingsList, activeSetting, onClick }) => {
    return settingsList.map((setting) => (
        <a
            key={setting.id}
            href={setting.href}
            onClick={(e) => {
                e.preventDefault();
                onClick(setting);
            }}
            className={`block px-4 py-2 font-bold border rounded-full mb-2 ${activeSetting === setting.id
                ? 'bg-blue-500 text-white'
                : 'bg-indigo-100 text-indigo-900 hover:bg-blue-500 hover:text-white'
                } border-gray-300`}
        >
            {setting.title}
        </a>
    ));
};

export default SettingsList;