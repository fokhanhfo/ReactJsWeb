import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useBreadcrumb } from './BreadcrumbContext';

export default function BasicBreadcrumbs() {
  const { breadcrumbs } = useBreadcrumb();

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbs.map((breadcrumb, index) =>
        breadcrumb.href ? (
          <Link key={index} underline="hover" color="inherit" href={breadcrumb.href}>
            {breadcrumb.label}
          </Link>
        ) : (
          <Typography key={index} sx={{ color: 'text.primary' }}>
            {breadcrumb.label}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
}
