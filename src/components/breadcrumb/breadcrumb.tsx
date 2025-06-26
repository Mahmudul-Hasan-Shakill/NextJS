"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ pageName }) => {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<
    { href: string; label: string }[]
  >([]);

  useEffect(() => {
    if (pathname) {
      const pathWithoutQuery = pathname.split("?")[0];
      const pathSegments = pathWithoutQuery
        .split("/")
        .filter((segment) => segment);

      const breadcrumbsList = pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const label =
          segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");

        return { href, label };
      });

      const lastCrumb = { href: pathWithoutQuery, label: pageName };

      setBreadcrumbs([
        { href: "/home", label: "Home" },
        ...breadcrumbsList.slice(0, -1),
        lastCrumb,
      ]);
    }
  }, [pathname, pageName]);

  return (
    <nav aria-label="breadcrumbs" className="m-4">
      <ol className="flex space-x-2 text-xs text-black dark:text-white font-bold bg-gray-300 dark:bg-gray-800 px-4 py-2 rounded">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="inline">
            {index < breadcrumbs.length - 1 ? (
              <Link href={breadcrumb.href} className="hover:underline">
                {breadcrumb.label}
              </Link>
            ) : (
              <span>{breadcrumb.label}</span>
            )}
            {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}{" "}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
