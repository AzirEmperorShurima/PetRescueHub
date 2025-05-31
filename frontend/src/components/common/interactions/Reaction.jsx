import React, { useState, useEffect, useRef } from 'react';
import { 
  IconButton, 
  Text, 
  HStack, 
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react';
import { 
  Heart,
  HeartFill,
  EmojiSmileFill,
  EmojiLaughingFill,
  EmojiSurpriseFill,
  EmojiFrownFill,
  EmojiAngryFill,
  EmojiHeartEyesFill
} from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';

// Định nghĩa các loại cảm xúc với Bootstrap Icons
const REACTION_TYPES = {
  like: {
    icon: EmojiSmileFill,
    label: 'Thích',
    color: 'blue.500',
    emoji: '👍'
  },
  love: {
    icon: EmojiHeartEyesFill,
    label: 'Yêu thích',
    color: 'pink.500',
    emoji: '❤️'
  },
  haha: {
    icon: EmojiLaughingFill,
    label: 'Haha',
    color: 'yellow.500',
    emoji: '😂'
  },
  wow: {
    icon: EmojiSurpriseFill,
    label: 'Wow',
    color: 'orange.500',
    emoji: '😮'
  },
  sad: {
    icon: EmojiFrownFill,
    label: 'Buồn',
    color: 'blue.600',
    emoji: '😢'
  },
  angry: {
    icon: EmojiAngryFill,
    label: 'Giận dữ',
    color: 'red.600',
    emoji: '😡'
  }
};

const Reaction = ({ 
  targetId,
  targetType = 'Post',
  reactions = {}, 
  userReaction = null, 
  onReact, 
  size = 'md', 
  showCount = true,
  variant = 'icon', // 'icon' hoặc 'emoji'
  isLoading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const closeTimeoutRef = useRef(null);
  
  // Local state để quản lý reactions và userReaction
  const [localReactions, setLocalReactions] = useState(reactions);
  const [localUserReaction, setLocalUserReaction] = useState(userReaction);
  
  // Cập nhật local state khi props thay đổi
  useEffect(() => {
    setLocalReactions(reactions);
  }, [reactions]);
  
  useEffect(() => {
    setLocalUserReaction(userReaction);
  }, [userReaction]);
  
  // Color mode values
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const popoverBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  // Tính tổng số reactions
  const totalReactions = Object.values(localReactions).reduce((sum, count) => sum + count, 0);

  // Lấy reaction hiện tại của user
  const currentReaction = localUserReaction ? REACTION_TYPES[localUserReaction] : null;

  // Helper function để tính toán reactions mới
  const calculateNewReactions = (currentReactions, oldUserReaction, newReactionType) => {
    const newReactions = { ...currentReactions };
    
    // Nếu user đã có reaction trước đó, giảm count của reaction cũ
    if (oldUserReaction && newReactions[oldUserReaction]) {
      newReactions[oldUserReaction] = Math.max(0, newReactions[oldUserReaction] - 1);
    }
    
    // Nếu có reaction mới (không phải remove), tăng count
    if (newReactionType) {
      newReactions[newReactionType] = (newReactions[newReactionType] || 0) + 1;
    }
    
    return newReactions;
  };

  const { user } = useAuth();

  // Xử lý click reaction
  const handleReactionClick = async (reactionType, e) => {
    if (!user) {
      // Show tooltip hoặc toast: "Đăng nhập để tương tác"
      return;
    }
    // Ngăn sự kiện lan truyền
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Tránh multiple clicks
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      // Lưu trạng thái hiện tại để rollback nếu cần
      const previousReaction = localUserReaction;
      const previousReactions = { ...localReactions };
      
      // Xác định reaction mới
      let newReactionType = null;
      if (localUserReaction === reactionType) {
        // Nếu click vào reaction đã chọn → bỏ reaction
        newReactionType = null;
      } else {
        // Nếu chọn reaction mới
        newReactionType = reactionType;
      }
      
      // Tính toán reactions mới
      const newReactions = calculateNewReactions(
        localReactions, 
        localUserReaction, 
        newReactionType
      );
      
      // Optimistic UI update
      setLocalReactions(newReactions);
      setLocalUserReaction(newReactionType);
      
      // Callback để parent component cập nhật state và gọi API
      if (onReact) {
        await onReact(newReactionType, newReactions);
      }
      
      
    } catch (error) {
      console.error('Error handling reaction:', error);
      
      // Rollback optimistic update
      setLocalReactions(previousReactions);
      setLocalUserReaction(previousReaction);
    } finally {
      setIsProcessing(false);
      setIsOpen(false);
    }
  };

  // Xử lý click vào nút chính (trái tim)
  const handleMainButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Nếu chưa có reaction, mặc định là 'love'
    // Nếu đã có reaction, remove reaction đó
    if (!localUserReaction) {
      handleReactionClick('love', e);
    } else {
      handleReactionClick(localUserReaction, e);
    }
  };

  // Xử lý hover với độ trễ
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  // Dọn dẹp timeout khi component unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Render reaction picker
  const ReactionPicker = () => (
    <HStack spacing={2} p={2}>
      {Object.entries(REACTION_TYPES).map(([type, config]) => {
        const isSelected = localUserReaction === type;
        return (
          <Tooltip key={type} label={user ? config.label : 'Đăng nhập để tương tác'} placement="top">
            <IconButton
              size="md"
              variant="ghost"
              onClick={(e) => handleReactionClick(type, e)}
              bg={isSelected ? hoverBg : 'transparent'}
              _hover={{ 
                bg: hoverBg,
                transform: 'scale(1.3)',
                transition: 'all 0.2s'
              }}
              _active={{
                transform: 'scale(1.1)'
              }}
              transition="all 0.01s"
              disabled={!user || isProcessing}
            >
              {variant === 'emoji' ? (
                <Text fontSize="2xl">{config.emoji}</Text>
              ) : (
                <Box as={config.icon} color={config.color} size={28} />
              )}
            </IconButton>
          </Tooltip>
        );
      })}
    </HStack>
  );

  // Render reaction summary (hiển thị top reactions)
  const ReactionSummary = () => {
    const topReactions = Object.entries(localReactions)
      .filter(([_, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    if (topReactions.length === 0) return null;

    return (
      <HStack spacing={1} fontSize="sm">
        {topReactions.map(([type, count]) => {
          const config = REACTION_TYPES[type];
          if (!config) return null;
          
          return (
            <HStack key={type} spacing={1}>
              {variant === 'emoji' ? (
                <Text fontSize="sm">{config.emoji}</Text>
              ) : (
                <Box as={config.icon} color={config.color} size="12px" />
              )}
              <Text fontSize="xs" color={textColor}>
                {count}
              </Text>
            </HStack>
          );
        })}
      </HStack>
    );
  };

  return (
    <HStack spacing={2}>
      <Popover 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        placement="top-start"
      >
        <PopoverTrigger>
          <IconButton
            size={size}
            variant="ghost"
            colorScheme={currentReaction ? 'blue' : 'gray'}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleMainButtonClick}
            _hover={{ bg: hoverBg }}
            disabled={isProcessing}
            opacity={isProcessing ? 0.6 : 1}
          >
            {currentReaction ? (
              variant === 'emoji' ? (
                <Text fontSize={size === 'sm' ? 'sm' : 'md'}>
                  {currentReaction.emoji}
                </Text>
              ) : (
                <Box 
                  as={currentReaction.icon} 
                  color={currentReaction.color}
                  size={size === 'sm' ? 16 : 20}
                />
              )
            ) : (
              <Heart size={size === 'sm' ? 16 : 20} />
            )}
          </IconButton>
        </PopoverTrigger>
        
        <PopoverContent 
          bg={popoverBg}
          borderColor={borderColor}
          shadow="lg"
          width="auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <PopoverBody p={1}>
            <ReactionPicker />
          </PopoverBody>
        </PopoverContent>
      </Popover>

      {showCount && (
        <Box>
          {totalReactions > 0 ? (
            <ReactionSummary />
          ) : (
            <Text fontSize="sm" color={textColor}>
              0
            </Text>
          )}
        </Box>
      )}
    </HStack>
  );
};

Reaction.propTypes = {
  targetId: PropTypes.string.isRequired,
  targetType: PropTypes.string,
  reactions: PropTypes.object,
  userReaction: PropTypes.oneOf(['like', 'love', 'haha', 'wow', 'sad', 'angry']),
  onReact: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  showCount: PropTypes.bool,
  variant: PropTypes.oneOf(['icon', 'emoji'])
};

export default Reaction;