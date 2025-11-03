import React from 'react';
import { Snackbar, Alert, AlertTitle, Box, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNotification, NotificationSeverity } from '../../contexts/NotificationContext';

export const Notification: React.FC = () => {
  const { notifications, removeNotification } = useNotification();
  
  console.log('Notification组件渲染，当前通知数量：', notifications.length);
  console.log('通知内容：', notifications);

  const handleClose = (id: string) => {
    removeNotification(id);
  };

  const getSeverityTitle = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'success':
        return '成功';
      case 'error':
        return '错误';
      case 'warning':
        return '警告';
      case 'info':
        return '信息';
      default:
        return '通知';
    }
  };

//   const getSeverityColor = (severity: NotificationSeverity) => {
//     switch (severity) {
//       case 'success':
//         return '#4caf50';
//       case 'error':
//         return '#f44336';
//       case 'warning':
//         return '#ff9800';
//       case 'info':
//         return '#2196f3';
//       default:
//         return '#757575';
//     }
//   };

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.autoHideDuration}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& .MuiSnackbar-root': {
              top: 24,
              right: 24,
            },
          }}
        >
                     <Alert
             onClose={() => handleClose(notification.id)}
             severity={notification.severity}
                           sx={{
                width: '100%',
                minWidth: '400px',
                maxWidth: '600px',
                '& .MuiAlert-icon': {
                  fontSize: '24px',
                },
                '& .MuiAlert-message': {
                  fontSize: '14px',
                  lineHeight: '1.5',
                  padding: '4px 0',
                },
              }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => handleClose(notification.id)}
                               sx={{
                 color: 'inherit',
                 '&:hover': {
                   opacity: 0.7,
                 },
               }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            <Box sx={{ py: 0.5 }}>
              <AlertTitle sx={{ fontWeight: 600, mb: 1, fontSize: '16px' }}>
                {getSeverityTitle(notification.severity)}
              </AlertTitle>
              <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                {notification.message}
              </Typography>
            </Box>
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};
