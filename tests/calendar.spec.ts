import { test, expect } from '@playwright/test';


//캘린더 탐색

test('tc_4000 | 캘린더 탭 진입', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await expect(page.getByText('캘린더')).toBeVisible();
  await expect(page.locator('.calendar')).toBeVisible();
});

test('tc_4002 | 월 이동 - 이전 달', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  const beforeMonth = await page.locator('.calendar-header').textContent();
  await page.getByRole('button', { name: '<' }).click();
  const afterMonth = await page.locator('.calendar-header').textContent();
  expect(beforeMonth).not.toBe(afterMonth);
});

test('tc_4003 | 월 이동 - 다음 달', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  const beforeMonth = await page.locator('.calendar-header').textContent();
  await page.getByRole('button', { name: '>' }).click();
  const afterMonth = await page.locator('.calendar-header').textContent();
  expect(beforeMonth).not.toBe(afterMonth);
});

test('tc_4004 | 날짜 선택 - 미선택', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await expect(page.locator('.today')).toBeVisible();
  await expect(page.locator('.schedule-area')).toBeVisible();
});

test('tc_4005 | 날짜 선택 : 일정 있는 날짜', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('일정 있는 날 테스트');
  await page.getByRole('button', { name: '추가' }).click();
  await page.locator('.today').click();
  await expect(page.getByText('일정 있는 날 테스트')).toBeVisible();
});

test('tc_4006 | 날짜 선택 : 일정 없는 날짜', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.getByRole('button', { name: '>' }).click();
  await page.locator('.calendar-day').first().click();
  await expect(page.getByText('일정이 없어요!')).toBeVisible();
});

test('tc_4007 | 날짜 선택 : 현재 날짜', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await expect(page.locator('.today')).toHaveClass(/selected|active/);
  await expect(page.locator('.schedule-area')).toBeVisible();
});

test('tc_4008 | 오늘 날짜 표시 - 색상 구분 확인', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await expect(page.locator('.today')).toBeVisible();
  await expect(page.locator('.today')).toHaveClass(/today|current/);
});

test('tc_4009 | 오늘 날짜 표시 - 앱 재진입 후 유지 확인', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.getByRole('button', { name: '홈' }).click();
  await page.getByRole('button', { name: '캘린더' }).click();
  await expect(page.locator('.today')).toBeVisible();
});

test('tc_4010 | 월 경계 이동 - 1월에서 이전 달', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  // 1월까지 이동
  while (!(await page.locator('.calendar-header').textContent())?.includes('1월')) {
    await page.getByRole('button', { name: '<' }).click();
  }
  const beforeText = await page.locator('.calendar-header').textContent();
  await page.getByRole('button', { name: '<' }).click();
  const afterText = await page.locator('.calendar-header').textContent();
  expect(afterText).toContain('12월');
  expect(beforeText).not.toBe(afterText);
});

test('tc_4011 | 월 경계 이동 - 12월에서 다음 달', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  // 12월까지 이동
  while (!(await page.locator('.calendar-header').textContent())?.includes('12월')) {
    await page.getByRole('button', { name: '>' }).click();
  }
  const beforeText = await page.locator('.calendar-header').textContent();
  await page.getByRole('button', { name: '>' }).click();
  const afterText = await page.locator('.calendar-header').textContent();
  expect(afterText).toContain('1월');
  expect(beforeText).not.toBe(afterText);
});

test('tc_4012 | 월 이동 - 월 이동 빠르게 연속 클릭', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: '>' }).click();
  }
  await expect(page.locator('.calendar')).toBeVisible();
  await expect(page.locator('.calendar-header')).toBeVisible();
});

test('tc_4013 | 월 이동 - 다른 탭 이동 후 복귀', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.getByRole('button', { name: '>' }).click();
  const monthText = await page.locator('.calendar-header').textContent();
  await page.getByRole('button', { name: '홈' }).click();
  await page.getByRole('button', { name: '캘린더' }).click();
  const afterText = await page.locator('.calendar-header').textContent();
  expect(afterText).toBe(monthText);
});

//일정 관리


test('tc_4020 | 일정 추가', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('테스트 일정');
  await page.getByRole('button', { name: '추가' }).click();
  await expect(page.getByText('테스트 일정')).toBeVisible();
});

test('tc_4021 | 일정 추가 : 공백 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill(' ');
  await expect(page.getByRole('button', { name: '추가' })).toBeDisabled();
});

test('tc_4022 | 일정 추가 : 특수문자 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('!@#$%');
  await expect(page.getByRole('button', { name: '추가' })).toBeDisabled();
});

test('tc_4023 | 일정 추가 : 1000자 이상 입력', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('가'.repeat(1001));
  await expect(page.getByText('1000자 이상 입력이 불가능해요')).toBeVisible();
  await expect(page.getByRole('button', { name: '추가' })).toBeDisabled();
});

test('tc_4025 | 일정 추가 : 중복 추가', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('첫 번째 일정');
  await page.getByRole('button', { name: '추가' }).click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('두 번째 일정');
  await page.getByRole('button', { name: '추가' }).click();
  await expect(page.getByText('첫 번째 일정')).toBeVisible();
  await expect(page.getByText('두 번째 일정')).toBeVisible();
});

test('tc_4024 | 일정 삭제', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '캘린더' }).click();
  await page.locator('.today').click();
  await page.getByRole('textbox', { name: '일정 입력' }).fill('삭제할 일정');
  await page.getByRole('button', { name: '추가' }).click();
  await page.getByText('삭제할 일정').locator('..').getByRole('button').click();
  await expect(page.getByText('삭제할 일정')).not.toBeVisible();
});