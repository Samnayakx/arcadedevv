import type { ReactNode } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export function ListViewShell({
  breadcrumb,
  title,
  titleIcon,
  tabs,
  activeTab,
  onTabChange,
  toolbar,
  children,
  pagination,
}: {
  breadcrumb: ReactNode;
  title: string;
  titleIcon?: ReactNode;
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  toolbar: ReactNode;
  children: ReactNode;
  pagination?: { page: number; totalPages: number; onPageChange: (page: number) => void };
}) {
  return (
    <div className="list-view">
      <div className="list-view-breadcrumb">{breadcrumb}</div>

      <div className="list-view-title-row">
        {titleIcon}
        <h2 className="list-view-title">{title}</h2>
      </div>

      <div className="list-view-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`list-view-tab${activeTab === tab.id ? " list-view-tab-active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="list-view-toolbar">{toolbar}</div>

      <div className="list-view-body dashboard-card">{children}</div>

      {pagination && (
        <div className="list-view-pagination">
          <button
            type="button"
            className="list-view-page-btn"
            aria-label="Previous page"
            disabled={pagination.page <= 1}
            onClick={() => pagination.onPageChange(pagination.page - 1)}
          >
            <CaretLeft size={14} weight="bold" />
          </button>
          {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                type="button"
                className={`list-view-page-btn${
                  pagination.page === page ? " list-view-page-btn-active" : ""
                }`}
                onClick={() => pagination.onPageChange(page)}
              >
                {page}
              </button>
            );
          })}
          {pagination.totalPages > 5 && (
            <>
              <span className="list-view-page-ellipsis">…</span>
              <button
                type="button"
                className="list-view-page-btn"
                onClick={() => pagination.onPageChange(pagination.totalPages)}
              >
                {pagination.totalPages}
              </button>
            </>
          )}
          <button
            type="button"
            className="list-view-page-btn"
            aria-label="Next page"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => pagination.onPageChange(pagination.page + 1)}
          >
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
      )}
    </div>
  );
}
