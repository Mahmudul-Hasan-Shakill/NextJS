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
    <nav aria-label="breadcrumbs" className="px-16 py-6 md:py-5 lg:py-5 ml-2 md:ml-12 lg:ml-12">
      <ol className="flex flex-wrap items-center space-x-2 text-[8px] md:text-xs lg:text-xs text-blue-600 dark:text-blue-400 font-bold py-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="inline">
            {index < breadcrumbs.length - 1 ? (
              <Link href={breadcrumb.href} className="hover:underline">
                {breadcrumb.label}
              </Link>
            ) : (
              <span className="text-gray-600 dark:text-gray-300">
                {breadcrumb.label}
              </span>
            )}
            {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
