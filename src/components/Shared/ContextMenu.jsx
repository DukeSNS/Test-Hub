import React, { useEffect, useRef } from 'react';
import { Edit2, Trash2, ArrowUp, ArrowDown, Eye } from 'lucide-react';

const ContextMenu = ({ x, y, onClose, items }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        const handleScroll = () => onClose();

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [onClose]);

    useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const menu = menuRef.current;
            if (rect.right > window.innerWidth) {
                menu.style.left = `${x - rect.width}px`;
            }
            if (rect.bottom > window.innerHeight) {
                menu.style.top = `${y - rect.height}px`;
            }
        }
    }, [x, y]);

    const iconMap = {
        view: <Eye size={15} />,
        edit: <Edit2 size={15} />,
        delete: <Trash2 size={15} />,
        moveUp: <ArrowUp size={15} />,
        moveDown: <ArrowDown size={15} />
    };

    return (
        <div
            ref={menuRef}
            className="context-menu"
            style={{ top: y, left: x }}
        >
            {items.map((item, index) => {
                if (item.separator) {
                    return <div key={index} className="context-menu-separator" />;
                }
                return (
                    <button
                        key={index}
                        className={`context-menu-item ${item.danger ? 'context-menu-item-danger' : ''} ${item.disabled ? 'context-menu-item-disabled' : ''}`}
                        onClick={() => {
                            if (!item.disabled) {
                                item.onClick();
                                onClose();
                            }
                        }}
                        disabled={item.disabled}
                    >
                        <span className="context-menu-icon">{iconMap[item.icon] || null}</span>
                        <span>{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default ContextMenu;
